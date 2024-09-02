import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-statusupdate',
  templateUrl: './statusupdate.component.html',
  styleUrls: ['./statusupdate.component.css']
})
export class StatusupdateComponent implements OnInit {

  statusupdateheader:string='Status Update';
  bookingno:number=0;
  jobtype:string='';
  activetask:any={};
  remarks:string='';
  texterrorstatus:number=0;
  statusvalue:string='';
  currentstatus:string='0';

  @ViewChild('elmstustatus') elminsptype:DropdownComponent;

  constructor( private service:PostService,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private SpinnerService:NgxSpinnerService,
    private toolbarservice:ToolbarService) { }

  ngOnInit(): void {
    this.toolbarservice.setData('Status Update');
    let taskdata=this.dataservice.getTaskData();
    console.log(taskdata)
    if(taskdata.rdocno=='' || taskdata.rdocno=='undefined' || typeof(taskdata.rdocno)=='undefined'){
      console.log("Entered If")
      this.statusupdateheader='Status Update';
    } else {
      console.log("Entered Else")
      this.getTripData(taskdata.rdocno,taskdata.rjobtype);
      this.bookingno=taskdata.rdocno;
    }
    this.SpinnerService.hide();
  }

  getTextValue(basevalue:any){
    this.remarks=basevalue;
  }

  getTripData(data:string,jobstype:string){
    this.service.getStartTripData(data,jobstype).subscribe(response=>{
      this.activetask=response[0];
      this.jobtype=jobstype;
      this.currentstatus=this.activetask.jobstatusid;
      console.log("Active Task Data - "+this.activetask);
      this.statusupdateheader='Trip #'+this.activetask.bookingno+' '+this.activetask.vehname+' - '+this.activetask.guest+' '+this.activetask.client;
    });
  }

  getAutoListValue(value:any,type:string){
    if(type=='statuslist'){
      this.statusvalue=value;
    }
  }

  onSubmitJob(){
    console.log("Submit");
    if(parseInt(this.currentstatus)>=parseInt(this.statusvalue)) {
      console.log(parseInt(this.currentstatus)+"  -  "+parseInt(this.statusvalue))
      this._snackbar.open('Cannot set previous status','Dismiss',{duration:2000});
      return false;
    }
    let statusdata={'date':this.dataservice.formatDate(new Date()),'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'bookingno':this.bookingno,'jobstatusid':this.statusvalue,'rjobtype':this.jobtype};
    console.log(statusdata);
    this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
      if(resp){
        this.service.setStatus(this.dataservice.formatJSONToURL(statusdata)).subscribe(response=>{
          if(response==true){
            this._snackbar.open('Status Successfully Updated','Dismiss',{duration:2000});
                this.router.navigate(['/home']);
          } else {
            this._snackbar.open('Not Saved','Dismiss',{duration:2000});
          }
        }, error=>{
          this._snackbar.open('Not Saved','Dismiss',{duration:2000});
        });
      }
    });
  }
}
