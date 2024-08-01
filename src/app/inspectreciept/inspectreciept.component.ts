import { Component, ElementRef, NgZone, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { NgSignaturePadOptions } from '@almothafar/angular-signature-pad/public-api';

import { HttpClient } from '@angular/common/http';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inspectreciept',
  templateUrl: './inspectreciept.component.html',
  styleUrls: ['./inspectreciept.component.css']
})
export class InspectrecieptComponent implements OnInit,AfterViewInit {
  imagedata:FormData=new FormData();
  reftype:string='';
  refdocno:string='';
  refvocno:string='';
  fleetno:string='';
  fleetregno:string='';
  fleetname:string='';
  docno:string='';
  brhid:string='';
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

  constructor(private http: HttpClient,private ngzone:NgZone, private service:PostService,private dataservice:DataService,private router:Router,private _snackbar:MatSnackBar,private confirm:ConfirmdialogService,private toolbarservice:ToolbarService,private SpinnerService:NgxSpinnerService) { }

  ngAfterViewInit(): void {
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
  ngOnInit(): void {
    var inspdata=this.dataservice.getInspectData();
    if(inspdata.inspectdocno!=null && inspdata.inspectdocno!='' && inspdata.inspectdocno!='undefined'){
      this.service.getSavedInspectData(this.dataservice.formatJSONToURL(inspdata)).subscribe(response=>{
        console.log(response);
        this.docno=response[0].docno;
        this.reftype=response[0].reftype;
        this.refdocno=response[0].refdocno;
        this.refvocno=response[0].refvocno;
        this.fleetno=response[0].fleetno;
        this.fleetregno=response[0].regdetails;
        this.fleetname=response[0].flname;
        this.brhid=response[0].brhid;
      });
    }
    this.SpinnerService.hide();
  }

  onClearSignature(){
    this.signaturePad.clear();
  }
  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    console.log('Completed drawing', event);
    console.log(this.signaturePad.toDataURL());
    
  }

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('Start drawing', event);
  }

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

  onUpdateInsp(){
    console.log(this.signaturePad.toDataURL());
    this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
      if(resp){
        this.SpinnerService.show();
        var blobdata=this.dataURLToBlob(this.signaturePad.toDataURL());
        this.imagedata.append('image',blobdata,'1');
        this.service.updateInspection(this.imagedata,this.docno,this.brhid).subscribe((response)=>{
          console.log(response);
          if(response){
            this.SpinnerService.hide();
            this._snackbar.open('Vehicle Inspection Updated','Dismiss',{duration:2000});
            var printwindow=window.open(this.toolbarservice.getErpData()+'/com/operations/vehicletransactions/vehicleinspection/inspectionMobilePrint.action?insp='+this.docno+'&agmtno='+this.refdocno+'&agmtype='+this.reftype,'_blank');
            printwindow.focus();
            this.ngzone.run(()=>{
              this.dataservice.clearInspectData();
              this.dataservice.clearTaskData();
              this.router.navigate(['/home']);
            });
          }
          else{
            this.SpinnerService.hide();
            this._snackbar.open('Not Updated','Dismiss',{duration:2000});
            return false;
          }
        },
        (error)=>{
          this.SpinnerService.hide();
          this._snackbar.open('Not Updated','Dismiss',{duration:2000});
          return false;
        });
      }
    });
    
  }
}
