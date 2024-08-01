import { Component, OnInit } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar'
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { ToolbarService } from '../services/toolbar.service';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-reciept',
  templateUrl: './reciept.component.html',
  styleUrls: ['./reciept.component.css']
})
export class RecieptComponent implements OnInit {
  brhid:string='';
  paytype:string='';
  cardtype:string='';
  clientvalue:string='';
  chequevalue:string='';
  cardvalue:string='';
  chequenoerrorstatus:number=0;
  cardnoerrorstatus:number=0;
  amountvalue:string='0.00';
  chequedatevalue:Date=new Date();
  minchequedate:Date=new Date();
  amounterrorstatus:number=0;
  descvalue:string='';
  texterrorstatus:number=0;

  constructor(
    private _snackbar:MatSnackBar,
    private service:PostService,
    private dataservice:DataService,
    private router:Router,
    private toolbarservice:ToolbarService,
    private confirm:ConfirmdialogService,
    private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.toolbarservice.setData('Create Reciept');
    this.spinner.hide();
  }
  getNumericValue(value:string,type:string){
    if(type=='Amount'){
      this.amountvalue=value;
    }
  }
  getTextValue(basevalue:any,type:string){
    if(type=='Description'){
      this.descvalue=basevalue;
    }
    else if(type=='Cheque'){
      this.chequevalue=basevalue;
    }
    else if(type=='Card'){
      this.cardvalue=basevalue;
    }
  }
  getDate(basedate:any){
    this.chequedatevalue=basedate;
  }
  getListValue(basevalue:any,type:string){
    if(type=='Branch'){
      this.brhid=basevalue;
    }
    else if(type=='PayType'){
      this.paytype=basevalue;
    }
    else if(type=='CardType'){
      this.cardtype=basevalue;
    }
  }

  getAutoListValue(value:string,type:string){
    if(type=='Client'){
      this.clientvalue=value;
    }
  }

  onSubmit(){
    let errorstatus=0;
    if(this.brhid=='' || this.brhid=='undefined' || typeof(this.brhid)=='undefined'){
      errorstatus=1;
      this._snackbar.open('Branch is Mandatory','Dismiss',{duration:2000});
      return false;
    }
    else if(this.clientvalue=='' || this.clientvalue=='undefined' || typeof(this.clientvalue)=='undefined'){
      errorstatus=1;
      this._snackbar.open('Client is Mandatory','Dismiss',{duration:2000});
      return false;
    }
    else if(this.paytype=='' || this.paytype=='undefined' || typeof(this.paytype)=='undefined'){
      errorstatus=1;
      this._snackbar.open('Pay type is Mandatory','Dismiss',{duration:2000});
      return false;
    }
    else if(this.paytype=='2'){
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
      let recieptdata={'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'brhid':this.brhid,'cldocno':this.clientvalue,'paytype':this.paytype,'cardtype':this.cardtype,'chequeno':this.chequevalue,'chequedate':this.dataservice.formatDate(this.chequedatevalue),'amount':this.amountvalue,'description':this.descvalue,'cardno':this.cardvalue};
      this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
        if(resp){
          this.service.saveRentalReciept(this.dataservice.formatJSONToURL(recieptdata)).subscribe(response=>{
            if(response==true){
              this._snackbar.open('Receipt Created','Dismiss',{duration:2000});
              this.router.navigate(['\home'])
            }
            else{
              this._snackbar.open('Not Created','Dismiss',{duration:2000});
              return false;
            }
          });
        }
      })
    }
  }
}
