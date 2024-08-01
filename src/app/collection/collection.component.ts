import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { NotificationComponent } from '../notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from "ngx-spinner";  
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { TimepickerComponent } from '../timepicker/timepicker.component';
import { NumericinputComponent } from '../numericinput/numericinput.component';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  @ViewChild('stepper') stepper:MatStepper;
  @ViewChild('pickupdate') pickupdate:DatepickerComponent;
  @ViewChild('pickuptime') pickuptime:TimepickerComponent;
  @ViewChild('pickupkm') pickupkm:NumericinputComponent;
  @ViewChild('pickupfuel') pickupfuel:DropdownComponent;

  activetask:any={};
  collectdatevalue:Date=new Date();
  collecttimevalue:string='';
  collectfuelvalue:any;
  collectkmvalue:any;
  closedate:Date=new Date();
  closetime:string='';
  closefuel:any;
  closekm:any;
  kmerrorstatus:number=0;
  closekmerrorstatus:number=0;
  clientname:string='';
  fleetname:string='';
  rdocno:string='';
  rdtype:string='';
  tripmode:string='';
  mindate:Date=new Date();
  minclosedate:Date=new Date();
  minkm:number=0;
  mintime:string='';
  basecollecttime:string=this.dataservice.getTimeOnly(new Date());
  baseclosetime:string=this.dataservice.getTimeOnly(new Date());
  brhid:string='';
  locid:string='';
  step1complete:boolean=false;
  step1edit:boolean=true;
  step2edit:boolean=false;
  step2complete:boolean=false;
  validatekm:number=0;
  usedkm:number=0;
  constructor(
    private dataservice:DataService,
    private service:PostService,
    private _snackbar: MatSnackBar,
    private router:Router,
    private SpinnerService: NgxSpinnerService,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService
    ) { }

  ngOnInit(): void {
    this.SpinnerService.show();
    //this.toolbarservice.setData('Collection Update');
    let params=this.dataservice.getTaskData();
    //Getting Active task details
    if(params.rdocno!='' && params.rdocno!='undefined' && typeof(params.rdocno)!='undefined'){
      this.getActiveTask(params);
    }
    this.SpinnerService.hide();
  }
  async getActiveTask(params:any){
    //console.log('Active Task Params');
    //console.log(params);
    this.SpinnerService.show(); 
    await this.service.getActiveTask(params).subscribe(response=>{
      this.activetask=response[0];
      console.log(this.activetask);
      this.validatekm=this.activetask.minkm;
      if(this.activetask.repstage==2){
        /*this.step1complete=true;
        this.step1edit=false;
        this.step2edit=false;
        this.step1complete=true;*/
        this.getPickupData(this.activetask.repno);
        //this.stepper.next();
      }
      //console.log(Object.entries(this.activetask));
      this.mindate=new Date(this.activetask.mindate);
      this.clientname=this.activetask.clientname;
      this.fleetname=this.activetask.fleetname;
      this.minkm=this.activetask.minkm;
      this.SpinnerService.hide(); 
    });
  }

   async getPickupData(repno){
     await this.service.getPickupData(repno).subscribe(resp=>{
      this.pickupdate.defaultdate=new Date(resp.pdate);
      this.basecollecttime=resp.ptime;
      this.pickupkm.initialvalue=resp.pkm;
      this.pickupfuel.selectedvalue=(resp.pfuel)+'';
      this.pickupdate.disabled=true;
      this.pickuptime.disabled=true;
      this.pickupkm.disabled=true;
      this.pickupfuel.disableDropdown(true);
      this.stepper.next();
    });
  }

  getTime(basetime:any,type:string){
    if(type=='Collect'){
      this.collecttimevalue=basetime;
    }
    else if(type=='Close'){
      this.closetime=basetime;
    }
  }
  getDate(basedate:any,type:string){
    if(type=='Collect'){
      this.collectdatevalue=basedate;
    }
    else if(type=='Close'){
      this.closedate=basedate;
    }
  }
  getFuelValue(fuelvalue:string,type:string){
    if(type=='Collect'){
      this.collectfuelvalue=fuelvalue;
    }
    else if(type=='Close'){
      this.closefuel=fuelvalue;
    }
  }
  getKmValue(kmvalue:string,type:string){
    if(type=='Collect'){
      this.collectkmvalue=kmvalue;
      this.usedkm=this.collectkmvalue-this.minkm;
    }
    else if(type=='Close'){
      this.closekm=kmvalue;
      this.usedkm=this.closekm-this.minkm;
    } 
  }

  getListValue(listvalue:string,type:string){
    if(type=='B'){
      this.brhid=listvalue;
    }
    else if(type=='L'){
      this.locid=listvalue;
    }
  }
  onBranchChange(value:string){

  }
  onStepNext(stepper:MatStepper,stepindex:number){
    if(this.activetask.repstage==2){
      stepper.selectedIndex=1;
    }
    if(stepindex==(this.activetask.repstage-1)){
      this.onSaveCollection(stepindex);
    }
  }


  onSaveCollection(stepindex:number){
    if(stepindex==0){

      this.kmerrorstatus=0;
      this.kmerrorstatus=this.dataservice.validateKm(this.collectkmvalue,this.minkm);
    
      if(this.collecttimevalue=='undefined' || this.collecttimevalue=='' || typeof(this.collecttimevalue)=='undefined'){
        this.collecttimevalue=this.basecollecttime;
      }
      let errorstatus=this.dataservice.validateTime(this.mindate,this.collectdatevalue,this.mintime,this.collecttimevalue);
      if(errorstatus==0 && this.kmerrorstatus==0){
        let collectdata={'fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype,'date':this.dataservice.formatDate(this.collectdatevalue),'time':this.collecttimevalue,'km':this.collectkmvalue,'fuel':this.collectfuelvalue,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'pickupdocno':this.activetask.repno};
        //console.log(collectdata);
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveAgmtCollection(this.dataservice.formatJSONToURL(collectdata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Agreement Collection Completed','Dismiss',{duration:2000});
                let params=this.dataservice.getTaskData();
                this.usedkm=0;
                let refdata={'inspecttype':'OUT','fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype};
                this.service.getInspectDetails(this.dataservice.formatJSONToURL(refdata)).subscribe((response)=>{
                  this.dataservice.setInspectData(response[0]);
                  this.router.navigate(['/inspection']);
                });
                //console.log('Collection Active Data after 1st step');
                //console.log(params);
                //Getting Active task details
                if(params.rdocno!='' && params.rdocno!='undefined' && typeof(params.rdocno)!='undefined'){
                  this.getActiveTask(params);
                  this.stepper.next();
                }
              }
              else{
                this._snackbar.open('Collection Not Completed','Dismiss',{duration:2000});
                return false;
              }
            },
            error=>{
              this._snackbar.open('Collection Not Completed','Dismiss',{duration:2000});
              return false;
            });
          }
        });
      }
      else{
        if(errorstatus!=0){
          this._snackbar.open('Time cannot be less than last out time','Dismiss');
        }
      }
    }
    else if(stepindex==1){

      this.closekmerrorstatus=0;
      this.closekmerrorstatus=this.dataservice.validateKm(this.closekm,this.minkm);
    
      if(this.closetime=='undefined' || this.closetime=='' || typeof(this.closetime)=='undefined'){
        this.closetime=this.baseclosetime;
      }
      let errorstatus=this.dataservice.validateTime(this.mindate,this.closedate,this.mintime,this.closetime);
      if(errorstatus==0 && this.closekmerrorstatus==0){

        let closedata={'brhid':this.brhid,'locid':this.locid,'fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype,'date':this.dataservice.formatDate(this.closedate),'time':this.closetime,'km':this.closekm,'fuel':this.closefuel,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'pickupdocno':this.activetask.repno};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveBranchCloseCollection(this.dataservice.formatJSONToURL(closedata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Agreement Branch Close Collection Completed','Dismiss',{duration:2000});
                let tripdata={'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype,'driverdocno':localStorage.getItem('token')};
                this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(rsp=>{
                  if(rsp==true){
                    this._snackbar.open('Trip Ended','Dismiss',{duration:2000});
                    this.router.navigate(['/home']);
                  }
                  else{
                    this._snackbar.open('Trip not updated','Dismiss',{duration:2000});
                  }
                })
                
              }
              else{
                this._snackbar.open('Branch Close Not Completed','Dismiss',{duration:2000});
                return false;
              }
            },
            error=>{
              this._snackbar.open('Branch Close Not Completed','Dismiss',{duration:2000});
              return false;
            });
          }
        });
        
      }
      else{
        if(errorstatus!=0){
          this._snackbar.open('Time cannot be less than last out time','Dismiss');
        }
      }
    }
  }
}
