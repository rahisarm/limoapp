import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { NgSignaturePadOptions } from '@almothafar/angular-signature-pad/public-api';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-endtrip',
  templateUrl: './endtrip.component.html',
  styleUrls: ['./endtrip.component.css']
})
export class EndtripComponent implements OnInit {

  activetask:any={};
  fleetvalue:string='';
  datevalue:Date=new Date();
  timevalue:string=this.dataservice.getTimeOnly(new Date());
  mindate:Date=new Date();
  basetime:string=this.dataservice.getTimeOnly(new Date());
  typevalue:string='';
  fuelvalue:string='';
  garagevalue:string='';
  remarks:string='';
  brhid:string='';
  locid:string='';
  texterrorstatus:number=0;
  endtripheader:string='End Trip';
  minkm:number=0;
  endtripstage:number=1;
  kmvalue:any;
  kmerrorstatus:number=0;
  usedkm:number=0;
  bookingno:number=0;
  imagedata:FormData=new FormData();
  items:Array<any>=[];
  uploadImage:File[]=[];
  acceptedfiles:string='';
  acceptedfilesarray:string[]=[];
  drawingsize:any={small:5};
  triggerMarkerSave:number=0;
  triggerSignatureSave:number=0;
  markerwidth:number=0;
  markerheight:number=0;
  signaturedata:Blob;
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  public signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300
  };

  dataURLToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  constructor(private service:PostService,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService,
    private SpinnerService:NgxSpinnerService) { }




  ngOnInit(): void {
    this.toolbarservice.setData('End Trip');
    let taskdata=this.dataservice.getTaskData();
    if(taskdata.rdocno=='' || taskdata.rdocno=='undefined' || typeof(taskdata.rdocno)=='undefined'){
      this.endtripheader='End Trip';
    } else {
      //console.log("Entered ON INIT");
      this.getTripData(taskdata.rdocno);
      this.bookingno=taskdata.rdocno;
    }
    this.SpinnerService.hide();
  }

  getTripData(data:string){
    this.service.getStartTripData(data).subscribe(response=>{
      this.activetask=response[0];
      //console.log(this.starttripstage+"::"+this.activetask.delivery+"::"+this.activetask.collection);
      //this.mindate=new Date(this.activetask.mindate);
      this.endtripheader='Trip #'+this.activetask.bookingno+' '+this.activetask.vehname+' - '+this.activetask.guest+', '+this.activetask.client;
      this.getAutoListValue(this.activetask.fleet,'Fleet');
      this.minkm=this.activetask.minkm;
    });
  }

  getAutoListValue(value:string,type:string){
    if(type=='Fleet'){
      this.getFleetMinData(value);
      this.fleetvalue=value;
    }
    else if(type=='Garage'){
      this.garagevalue=value;
    }
    
  }

  getFleetMinData(value:string){
    this.service.getEndFleetMinData(value).subscribe(response=>{
      this.activetask=response[0];
      this.mindate=new Date(this.activetask.mindate);
      this.minkm=this.activetask.minkm;
      console.log("Get Fleet Min Data"+this.minkm);
    });
  }

  getDate(basedate:any){
    this.datevalue=basedate;
  }
  getTime(basetimevalue:any){
    this.timevalue=basetimevalue;
  }
  getTextValue(basevalue:any){
    this.remarks=basevalue;
  }
  getKmValue(value:string){
    this.kmvalue=value;
    this.usedkm=this.kmvalue-this.minkm;
   // console.log("This is KM Value = "+this.usedkm);
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

  
  onClearSignature(){
    this.signaturePad.clear();
  }
  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
   // console.log('Completed drawing', event);
    //console.log(this.signaturePad.toDataURL());
    
  }

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
   // console.log('Start drawing', event);
  }

  onSubmit(){
    let errorstatus=0;
    let iskmerror=0;
    if(this.endtripstage==1){
     // console.log("Onsubmit - "+this.activetask.rdocno+" - "+this.activetask.mintime)+" - "+this.activetask.minkm;
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      iskmerror=this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(iskmerror>0 ){
        this._snackbar.open('Input Error!','Dismiss',{duration:2000});
        return false;
      } 
      if(errorstatus==0){
        console.log("bookingno - "+this.bookingno);
        var blobdata=this.dataURLToBlob(this.signaturePad.toDataURL());
        this.imagedata.append('image',blobdata,'1');
        for(let i=0;i<this.uploadImage.length;i++){
        //  console.log('File :'+this.uploadImage[i].name);
          this.imagedata.append('image',this.uploadImage[i],i+1+'');
        }
       // console.log("Image Data - "+this.dataservice.formatDate(this.datevalue)+" Date "+this.dataservice.formatDate(new Date()));
        let endtripdata={'fleetno':this.fleetvalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'bookingno':this.bookingno};
        
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.SpinnerService.show();
            this.service.saveEndTripInsert(this.imagedata,this.dataservice.formatJSONToURL(endtripdata)).subscribe(response=>{
              if(response==true){
                this.SpinnerService.hide();
                this._snackbar.open('Trip Successfully Ended','Dismiss',{duration:2000});
                this.router.navigate(['/home']);
              }
              else{
                this.SpinnerService.hide();
                this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              }
            },
            error=>{
              this.SpinnerService.hide();
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            });
          }
        });
      }
   }
  }

}
