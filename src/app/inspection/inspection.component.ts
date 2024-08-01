import { Component, ElementRef, NgZone, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ImagemarkerComponent } from '../imagemarker/imagemarker.component';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit,AfterViewInit {
  activetask:any={};
  items:Array<any>=[];
  uploadImage:File[]=[];
  drawingsize:any={small:5};
  imagedata:FormData=new FormData();
  triggerMarkerSave:number=0;
  triggerSignatureSave:number=0;
  markerwidth:number=0;
  markerheight:number=0;
  showFleetSearch:number=1;
  fleetvalue:string='';
  inspreftype:string='';
  insptype:string='';
  brhid:string='';
  insprdocno:string='';
  lastinspvocno:string='';
  lastinspreftype:string='';
  lastinspdate:string='';
  lastinsprefno:string='';
  lastinspimgpath:string='';
  initialRefDocNo:string='';
  acceptedfiles:string='';
  acceptedfilesarray:string[]=[];
  @ViewChild('imagemarkercontainer') canvasparent!:ElementRef;
  @ViewChild(ImagemarkerComponent) imgmarker!:ImagemarkerComponent;

  @ViewChild('elminspfleet') elminspfleet:AutocompleteComponent;
  @ViewChild('elminsptype') elminsptype:DropdownComponent;
  @ViewChild('elminspreftype') elminspreftype:DropdownComponent;
  @ViewChild('elminspbrhid') elminspbrhid:DropdownComponent;
  @ViewChild('elminsprdocno') elminsprdocno:AutocompleteComponent;

  constructor(
    private toolbarservice:ToolbarService,
    private ngzone:NgZone,
    private service:PostService,
    private dataservice:DataService,
    private router:Router,
    private _snackbar:MatSnackBar,
    private confirm:ConfirmdialogService,
    private SpinnerService:NgxSpinnerService) { }

  getAutoListValue(value:any,type:string){
    if(type=='inspfleet'){
      this.fleetvalue=value;
      this.getLastInspectData(this.fleetvalue);
      this.getInspLatestFleetData(this.fleetvalue);
      this.lastinspvocno='';
      this.lastinspreftype='';
      this.lastinspdate='';
      this.lastinsprefno='';
      this.lastinspimgpath='';
      this.initialRefDocNo='';
      this.getLastInspectData(this.fleetvalue);
    }
    else if(type=='insprdocno'){
      this.insprdocno=value;
    }
    
    /*this.service.getRefInspData(this.fleetvalue).subscribe((response)=>{
      this.service.getInspectDetails(this.dataservice.formatJSONToURL(response[0])).subscribe((resp)=>{
        this.dataservice.setInspectData(resp[0]);
        this.activetask=this.dataservice.getInspectData();
      });
    });*/
  }

  getInspLatestFleetData(fleetno:string){
    this.service.getInspLatestFleetData(fleetno).subscribe(resp=>{
      this.elminsptype.selectedvalue=resp.vehstatus+'';
      this.elminsptype.changeOption(resp.vehstatus+'');
      this.elminspreftype.selectedvalue=resp.refdoctype+'';
      this.elminspreftype.changeOption(resp.refdoctype+'');

      this.elminspbrhid.selectedvalue=resp.brhid+'';
      this.elminspbrhid.changeOption(resp.brhid+'');
      this.elminsprdocno.initialValue=resp.refdocno+'';
      this.insprdocno=resp.refdocno+'';
      /*var datalist=this.elminsprdocno.options=[];
      var params='type='+resp.vehstatus+'&reftype='+resp.refdoctype+'&brhid='+resp.brhid+'&fleetno='+this.fleetvalue;
      this.service.getInspRefDoc(params).subscribe(rsp=>{
        Object.values(rsp).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.elminsprdocno.options=datalist;
        this.elminsprdocno.loadFn();
        this.elminsprdocno.initialValue=resp.refdocno+'';
        this.initialRefDocNo=resp.refdocno+'';
      });
      */
    });
  }
  ngAfterViewInit(): void {
    this.markerwidth=this.canvasparent.nativeElement.offsetWidth;
    this.markerheight=this.canvasparent.nativeElement.offsetHeight;
  }
  ngOnInit(): void {
    this.service.getFileTypes().subscribe((resp:[])=>{
      resp.forEach(element => {
        this.acceptedfilesarray.push("."+(element["filetype"]+"").toLowerCase());
        if(this.acceptedfiles==""){
          this.acceptedfiles+="."+(element["filetype"]+"").toLowerCase();
        }
        else{
          this.acceptedfiles+=","+"."+(element["filetype"]+"").toLowerCase();
        }
      });
    })

    this.toolbarservice.setData('Inspection');
    //this.router.navigate(['/inspectreciept']);
    this.activetask=this.dataservice.getInspectData();
    if(this.activetask.inspectdocno=="" || this.activetask.inspectdocno=="undefined" || typeof(this.activetask.inspectdocno)=="undefined"){
      this.showFleetSearch=1;
    }
    else{
      this.showFleetSearch=0;
      this.getLastInspectData(this.activetask.inspectfleetno);
    }
    console.log(this.activetask);
    this.SpinnerService.hide();
    //console.log('View Port'+this.imgmarkerparent.nativeElement.offsetWidth,this.imgmarkerparent.nativeElement.offsetHeight);
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

  imageUploadAction(){

    this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
      if(resp){
        this.imgmarker.saveImage();
      }
    });
    //console.log(this.uploadImage);
    
  }
  saveMarkedImage(imgdata:Blob){
    console.log(JSON.stringify(imgdata));
    this.imagedata.append('image',imgdata,this.uploadImage.length+'');
    for(let i=0;i<this.uploadImage.length;i++){
      console.log('File :'+this.uploadImage[i].name);
      this.imagedata.append('image',this.uploadImage[i],i+'');
    }

    let inspectdata={};
    if(this.showFleetSearch==1){
      inspectdata={'date':this.dataservice.formatDate(new Date()),'time':this.dataservice.getTimeOnly(new Date),'type':this.insptype,'reftype':this.inspreftype,'brhid':this.brhid,'rdocno':this.insprdocno,'fleetno':this.fleetvalue,'userid':localStorage.getItem("userid")};
    }
    else{
      inspectdata={'date':this.dataservice.formatDate(new Date()),'time':this.dataservice.getTimeOnly(new Date),'type':this.activetask.inspecttype,'reftype':this.activetask.inspectrdtype,'brhid':this.activetask.inspectbrhid,'rdocno':this.activetask.inspectdocno,'refvocno':this.activetask.inspectvocno,'fleetno':this.activetask.inspectfleetno,'userid':localStorage.getItem("userid")};
    }

    


    this.SpinnerService.show();
    
        this.service.saveInspection(this.imagedata,this.dataservice.formatJSONToURL(inspectdata)).subscribe((response)=>{
          console.log('Insp Response'+response);
          if(parseInt(response+"")>0){
            this.SpinnerService.hide();
            this.dataservice.setInspectData({'docno':response});
            this._snackbar.open('Vehicle Inspection Created','Dismiss',{duration:2000});
            this.ngzone.run(()=>{
              this.router.navigate(['/inspectreciept']);
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
      //}
    //})
    
  }
  saveMarkedSignature(sigdata:Blob){

  }
  onDeleteItem(item){
    const index=this.items.indexOf(item);
    this.items.splice(index,1);   
    this.uploadImage.splice(index,1); 
  }

  getListValue(basevalue:any,type:string){
    if(type=='inspreftype'){
      this.inspreftype=basevalue;
    }
    else if(type=='insptype'){
      this.insptype=basevalue;
    }
    else if(type=='Branch'){
      this.brhid=basevalue;
    }
  }


  getLastInspectData(fleetno:string){
    this.service.getLastInspData(fleetno).subscribe(response=>{
      if(response!='undefined' && response!=null && typeof(response)!='undefined' && Object.keys(response).length>0){  
        this.lastinspdate=response[0].date;
        this.lastinsprefno=response[0].refvocno;
        this.lastinspreftype=response[0].reftype;
        this.lastinspvocno=response[0].docno;
        var rawimgpath=response[0].imagepath;
        this.lastinspimgpath='';
        if(rawimgpath!=null && rawimgpath!='' && rawimgpath!='undefined' && typeof(rawimgpath)!='undefined'){
          rawimgpath=rawimgpath.replace(/\\/g, "/");
          var erporigin=response[0].regdetails;
          var custompath=erporigin+'/attachment/'+rawimgpath.split('attachment/')[1];
          this.lastinspimgpath=custompath;
        }
      }
      
      
      //this.lastinspimgpath=this.service.setImagePath(response[0].imagepath);     
    })
  }
}
