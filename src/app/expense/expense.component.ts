import { Component, ViewChild, OnInit, OnChanges, AfterViewInit,ChangeDetectorRef,NgZone } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  job:String='';
  bookno:String='';
  activetask:any={};
  jobnovalue:string='';
  chequevalue:string='';
  cardvalue:string='';
  chequenoerrorstatus:number=0;
  cardnoerrorstatus:number=0;
  clientvalue:string='';
  client:string='';
  initclient:string='';
  descvalue:string='';
  datevalue:Date=new Date();
  timevalue:string=this.dataservice.getTimeOnly(new Date());
  mindate:Date=new Date();
  basetime:string=this.dataservice.getTimeOnly(new Date());
  typevalue:string='';
  paytype:string='';
  chequedatevalue:Date=new Date();
  minchequedate:Date=new Date();
  cardtype:string='';
  items:Array<any>=[];
  uploadImage:File[]=[];
  imagedata:FormData=new FormData();
  acceptedfiles:string='';
  acceptedfilesarray:string[]=[];
  @ViewChild('elmjobno') elmjobno:AutocompleteComponent;
  

  remarks:string='';
  brhid:string='';
  locid:string='';
  texterrorstatus:number=0;
  expenseheader:string='Add Expense';
  amountvalue:string='';
  expensestage:number=1;
  amounterrorstatus:number=0;
  constructor(private service:PostService,
    private ngzone:NgZone,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService,
    private SpinnerService:NgxSpinnerService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.SpinnerService.hide();
  }

  getDate(basedate:any){
    this.chequedatevalue=basedate;
  }
  
  getNumericValue(basevalue:string,type:string){
    if(type=='Amount'){
      this.amountvalue=basevalue;
    } 
    else if(type=='Cheque'){
      this.chequevalue=basevalue;
    }
    else if(type=='Card'){
      this.cardvalue=basevalue;
    } 
  }

  getListValue(basevalue:any,type:string){
    if(type=='PayType'){
      this.paytype=basevalue;
    }
    else if(type=='CardType'){
      this.cardtype=basevalue;
    }
  }

  getClientDetails(value:string,type:string){
    if(type=='jobno'){
      this.getclient(value);
    }
  }

  getclient(jobno:string){
    this.bookno=jobno.split('-')[0];
    this.job=jobno.split('-')[1];

   // console.log(jobno);
    this.service.getClientByJob(jobno).subscribe(response=>{
      if(response){
        this.clientvalue=response[0].client;
        this.client=response[0].client;
        this.brhid=response[0].branch;
      }
    })
  }

  getTextValue(basevalue:any,type:string){
    if(type=='Description'){
      this.descvalue=basevalue;
    } 
  }

  onDeleteItem(item){
    const index=this.items.indexOf(item);
    this.items.splice(index,1);   
    this.uploadImage.splice(index,1); 
  }

  onFileChange(event:any){
    const inputElement = event.target as HTMLInputElement;
    const fileList: FileList | null = inputElement.files;
    if (fileList && fileList.length > 0) {
      for(var i=0;i<fileList.length;i++){
        const file=fileList[i];
        const filename=file.name.toLowerCase();
        const fileext=filename.split(".").pop();
        if(this.acceptedfilesarray.length>0){
          if(!this.acceptedfilesarray.includes("."+fileext)){
            this._snackbar.open("."+fileext+' files not allowed','Dismiss',{duration:2000});
            inputElement.value='';
            return false;
          }
        }
      }
    }
    
    if(event.target.files){
      for(let i=0;i<event.target.files.length;i++){
        var reader=new FileReader();
        reader.onload=(event:any)=>{
          //this.url=event.target.result;
          this.items.push({'url':event.target.result});
        }
        reader.readAsDataURL(event.target.files[i]);
        this.uploadImage.push(event.target.files[i]);
      }
    }
  }

  onSubmit(){
    let errorstatus=0;
    if(this.paytype=='' || this.paytype=='undefined' || typeof(this.paytype)=='undefined'){
      errorstatus=1;
      this._snackbar.open('Pay type is Mandatory','Dismiss',{duration:2000});
      return false;
    }else if(this.paytype=='2'){
      if(this.cardtype=='' || this.cardtype=='undefined' || typeof(this.cardtype)=='undefined'){
        errorstatus=1;
        this._snackbar.open('Card type is Mandatory','Dismiss',{duration:2000});
        return false;
      }  
      if(this.cardvalue=='' || this.cardvalue=='undefined' || typeof(this.cardvalue)=='undefined'){
        errorstatus=1;
        this._snackbar.open('Card No is Mandatory','Dismiss',{duration:2000});
        return false;
      }
      if(this.cardvalue.length>16){
        errorstatus=1;
        this._snackbar.open('Max 16 digits allowed','Dismiss',{duration:2000});
        return false;
      }
    }
    else if(this.paytype=='3'){
      if(this.chequevalue=='' || this.chequevalue=='undefined' || typeof(this.chequevalue)=='undefined'){
        errorstatus=1;
        this._snackbar.open('Cheque No is Mandatory','Dismiss',{duration:2000});
        return false;
      }
      if(this.chequedatevalue==null || typeof(this.chequedatevalue)=='undefined'){
        errorstatus=1;
        this._snackbar.open('Cheque Date is Mandatory','Dismiss',{duration:2000});
        return false;
      }
    }
    else if(this.amountvalue=='' || this.amountvalue=='undefined' || typeof(this.amountvalue)=='undefined'){
      errorstatus=1;
      this.amounterrorstatus=1;
      this._snackbar.open('Pay type is Mandatory','Dismiss',{duration:2000});
      return false;
    }
    if(errorstatus==0){

      for(let i=0;i<this.uploadImage.length;i++){
       // console.log('File :'+this.uploadImage[i].name);
        this.imagedata.append('image',this.uploadImage[i],i+'');
      }

      let expensedata={'job':this.job,'bookno':this.bookno,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'paytype':this.paytype,'cardtype':this.cardtype,'chequeno':this.chequevalue,'chequedate':this.dataservice.formatDate(this.chequedatevalue),'amount':this.amountvalue,'description':this.descvalue,'cardno':this.cardvalue,'brhid':this.brhid};
      this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
        if(resp){
          this.service.saveExpense(this.imagedata,this.dataservice.formatJSONToURL(expensedata)).subscribe((response)=>{
           // console.log('Insp Response'+response);
            if(response){
              this.SpinnerService.hide();
              this._snackbar.open('Successfully Saved','Dismiss',{duration:2000});
              this.ngzone.run(()=>{
                setTimeout(() => {this.router.navigate(['/home']);},2000)
              });
            }
            else{
              this.SpinnerService.hide();
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              return false;
            }
          },
          (error)=>{
            this.SpinnerService.hide();
            this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            return false;
          });
        }
      });
    }
  }

}
