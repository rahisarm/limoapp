import { Component, OnInit,ContentChild,ViewChild } from '@angular/core';
import { FormBuilder,Validators} from '@angular/forms';
import { DataService } from '../data.service';
import { MatStepper} from '@angular/material/stepper'
import { PostService } from '../services/post.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Router} from '@angular/router'
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { TimepickerComponent } from '../timepicker/timepicker.component';
import { NumericinputComponent } from '../numericinput/numericinput.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TextWidgetComponent } from '../text-widget/text-widget.component';
import { TextinputComponent } from '../textinput/textinput.component';
@Component({
  selector: 'app-replacement',
  templateUrl: './replacement.component.html',
  styleUrls: ['./replacement.component.css']
})
export class ReplacementComponent implements OnInit {
  @ViewChild('stepper') stepper!:MatStepper;

  @ViewChild('collectdate') collectdate:DatepickerComponent;
  @ViewChild('collecttime') collecttime:TimepickerComponent;
  @ViewChild('collectkm') collectkm:NumericinputComponent;
  @ViewChild('collectfuel') collectfuel:DropdownComponent;
  @ViewChild('collectwidget') collectwidget:TextWidgetComponent;
  @ViewChild('deldate') deldate:DatepickerComponent;
  @ViewChild('deltime') deltime:TimepickerComponent;
  @ViewChild('delkm') delkm:NumericinputComponent;
  @ViewChild('delfuel') delfuel:DropdownComponent;
  @ViewChild('delwidget') delwidget:TextWidgetComponent;
  @ViewChild('delto') delto:TextinputComponent;

  activetask:any={};
  mincollectdate:Date=new Date();
  collectdatevalue:Date=new Date();
  collecttimevalue:string=this.dataservice.getTimeOnly(new Date());
  collectfuelvalue:any;
  collectkmvalue:any;
  collectkmerrorstatus:number=0;

  mindeldate:Date=new Date();
  deldatevalue:Date=new Date();
  deltimevalue:string=this.dataservice.getTimeOnly(new Date());
  delfuelvalue:any;
  delkmvalue:any;
  delkmerrorstatus:number=0;
  deliverto:string='';
  deltexterrorstatus:number=0;

  minindate:Date=new Date();
  inbranchvalue:string='';
  inlocvalue:string='';
  indatevalue:Date=new Date();
  intimevalue:string='';
  infuelvalue:any;
  inkmvalue:any;
  inkmerrorstatus:number=0;
  basecollecttime:string=this.dataservice.getTimeOnly(new Date());
  basedeltime:string=this.dataservice.getTimeOnly(new Date());
  baseintime:string=this.dataservice.getTimeOnly(new Date());
  minkm:number=0;
  usedkm:number=0;
  rfleetno:number=0;
  inspcollectconfig:number=0;
  constructor(
    private dataservice:DataService,
    private service:PostService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService) { }

  ngOnInit(): void {
    this.toolbarservice.setData('Replacement Update');
    //const configdata=
    this.service.getConfigData("RepCollectInsp").subscribe(resp=>{
      if(resp.length>0){
        this.inspcollectconfig=resp[0].docno;
      }
    });
    
    //Getting Replacement Data
    let params=this.dataservice.getTaskData();
    if(params.rdocno!='' && params.rdocno!='undefined'){
      this.getActiveTask(params);
      this.getReplacementData(params);
    }
    
  }
  
  async getReplacementData(params){
    await this.service.getReplacementData(params).subscribe(response=>{
      let repdata=response[0];
      this.rfleetno=repdata.rfleetno;
      if(repdata.rentaltype=='2' || repdata.rentaltype=='3'){
        console.log('Inside Collection Completed');
        //Collection Completed
        this.collectdate.defaultdate=new Date(repdata.collectdate);
        this.basecollecttime=repdata.collecttime;
        this.collectkm.initialvalue=repdata.collectkm;
        this.collectfuel.selectedvalue=repdata.collectfuel;
        
        this.collectdate.disabled=true;
        this.collecttime.disabled=true;
        this.collectkm.disabled=true;
        this.collectfuel.disableDropdown(true);
        /*let usedkm=this
        this.collectwidget.widgetvaluesecond=repdata.*/
      }

      if(repdata.rentaltype=='3'){
        console.log('Inside Delivery Completed');
        //Delivery Completed
        this.deldate.defaultdate=new Date(repdata.deldate);
        this.basedeltime=repdata.deltime;
        this.delkm.initialvalue=repdata.delkm;
        this.delfuel.selectedvalue=repdata.delfuel;
        this.delto.initialvalue=repdata.agmttrancode;

        this.deldate.disabled=true;
        this.deltime.disabled=true;
        this.delkm.disabled=true;
        this.delfuel.disableDropdown(true);
        this.delto.disableInput(true);
      }
    });
  }
  async getActiveTask(params:any){
    await this.service.getActiveTask(params).subscribe(response=>{
      this.activetask=response[0];
      this.minkm=this.activetask.minkm;
      console.log(response[0]);
      if(this.activetask.repstage=='1'){
        this.mincollectdate=new Date(this.activetask.mindate);
      }
      else if(this.activetask.repstage=='2'){
        this.mindeldate=new Date(this.activetask.mindate);
        this.stepper.next();
      }
      else if(this.activetask.repstage=='3'){
        this.minindate=new Date(this.activetask.mindate);
        this.stepper.next();
        this.stepper.next();
      }

      this.getReplacementData(params);
    });
  }
  getDate(basedate:any,type:string){
    if(type=='D'){
      this.deldatevalue=basedate;
    }
    else if(type=='C'){
      this.collectdatevalue=basedate;
    }
    else if(type=='I'){
      this.indatevalue=basedate;
    }
  }
  getTime(basetime:any,type:string){
    if(type=='D'){
      this.deltimevalue=basetime;
    }
    else if(type=='C'){
      this.collecttimevalue=basetime;
    }
    else if(type=='I'){
      this.intimevalue=basetime;
    }
  }
  getListValue(listvalue:string,type:string){
    if(type=='D'){
      this.delfuelvalue=listvalue;
    }
    else if(type=='C'){
      this.collectfuelvalue=listvalue;
    }
    else if(type=='I'){
      this.infuelvalue=listvalue;
    }
    else if(type=='IB'){
      this.inbranchvalue=listvalue;
    }
    else if(type=='IL'){
      this.inlocvalue=listvalue;
    }
  }
  getKmValue(kmvalue:string,type:string){
    if(type=='D'){
      this.delkmvalue=kmvalue;
    }
    else if(type=='C'){
      this.collectkmvalue=kmvalue;
    }
    else if(type=='I'){
      this.inkmvalue=kmvalue;
    }
    this.usedkm=parseFloat(kmvalue)-this.minkm;
  }
  getTextValue(textvalue:string,type:string){
    if(type=='D'){
      this.deliverto=textvalue;
    }
  }

  onBranchChange(value){

  }

  onStepNext(stepper:MatStepper,stepindex:number,mode:number){
    console.log(stepindex+"::"+mode);
    var errorstatus=0;
    if(this.activetask.repstage==2){
      stepper.selectedIndex=1;
    }
    else if(this.activetask.repstage==3){
      stepper.selectedIndex=2;
    }
    if(mode==1 && stepindex==(this.activetask.repstage-1)){
      this.saveReplacement(stepindex);
    }    
    
  }

  saveReplacement(stepindex:number){
    let errorstatus=0;
    if(stepindex==0){
      errorstatus=this.dataservice.validateTime(new Date(this.activetask.mindate),this.collectdatevalue,this.activetask.mintime,this.collecttimevalue)
      this.collectkmerrorstatus=this.dataservice.validateKm(this.collectkmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.collectkmerrorstatus==0){
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            let collectdata={'repno':this.activetask.repno,'rdtype':this.activetask.rdtype,'date':this.dataservice.formatDate(this.collectdatevalue),'time':this.collecttimevalue,'km':this.collectkmvalue,'fuel':this.collectfuelvalue,'drvdocno':localStorage.getItem('token')}
            this.service.saveRepCollection(this.dataservice.formatJSONToURL(collectdata)).subscribe(response=>{
              console.log(response);
              if(response==true){
                //stepper.next();
                if(this.inspcollectconfig>0){
                  let refdata={'inspecttype':'OUT','fleetno':this.rfleetno,'rdocno':this.activetask.rdocno,'rdtype':'REP','repno':this.activetask.repno};
                  this.service.getInspectDetails(this.dataservice.formatJSONToURL(refdata)).subscribe(inspresp=>{
                    console.log('Inspect Data');console.log(inspresp);
                    this.dataservice.setInspectData(inspresp[0]);
                    this.router.navigate(['/inspection']);
                  });
                }
                
                this.getActiveTask(this.dataservice.getTaskData());
              }
            });
          }
        });

      }
    }
    else if(stepindex==1){
      errorstatus=this.dataservice.validateTime(new Date(this.activetask.mindate),this.deldatevalue,this.activetask.mintime,this.deltimevalue);
      this.delkmerrorstatus=this.dataservice.validateKm(this.delkmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.delkmerrorstatus==0){
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            let deldata={'repno':this.activetask.repno,'rdtype':this.activetask.rdtype,'date':this.dataservice.formatDate(this.deldatevalue),'time':this.deltimevalue,'km':this.delkmvalue,'fuel':this.delfuelvalue,'drvdocno':localStorage.getItem('token'),'deliverto':this.deliverto}
            this.service.saveRepDelivery(this.dataservice.formatJSONToURL(deldata)).subscribe(response=>{
              console.log(response);
              if(response==true){
                //stepper.next();
                let refdata={'inspecttype':'OUT','fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':'REP','repno':this.activetask.repno};
                  this.service.getInspectDetails(this.dataservice.formatJSONToURL(refdata)).subscribe(inspresp=>{
                    console.log('Inspect Data');console.log(inspresp);
                    this.dataservice.setInspectData(inspresp[0]);
                    this.router.navigate(['/inspection']);
                  });
                this.getActiveTask(this.dataservice.getTaskData());
              }
            });
          }
        })
        
      }      
    }
    else if(stepindex==2){
      this.intimevalue=this.intimevalue==''?this.baseintime:this.intimevalue;
      errorstatus=this.dataservice.validateTime(new Date(this.activetask.mindate),this.indatevalue,this.activetask.mintime,this.intimevalue);
      if(errorstatus==1){
        this._snackbar.open('Future Time not allowed','Dismiss',{duration:2000});
        return false;
      }
      this.inkmerrorstatus=this.dataservice.validateKm(this.inkmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.inkmerrorstatus==0){
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            let indata={'repno':this.activetask.repno,'rdtype':this.activetask.rdtype,'rdocno':this.activetask.rdocno,'date':this.dataservice.formatDate(this.indatevalue),'time':this.intimevalue,'km':this.inkmvalue,'fuel':this.infuelvalue,'drvdocno':localStorage.getItem('token'),'brhid':this.inbranchvalue,'locid':this.inlocvalue};
            this.service.saveRepClosing(this.dataservice.formatJSONToURL(indata)).subscribe(response=>{
              console.log(response);
              if(response==true){
                this._snackbar.open('Replacement successfully closed','Dismiss',{duration:2000});
                let tripdata={'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype,'driverdocno':localStorage.getItem('token')};
                this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(tripresp=>{
                  if(tripresp){
                    this._snackbar.open('Trip Ended','Dismiss',{duration:2000});
                    this.router.navigate(['/home']);
                  }
                  else{
                    this._snackbar.open('Trip Not Updated','Dismiss',{duration:2000});
                  }
                })
                
              }
              else{
                this._snackbar.open('Replacement Not Updated','Dismiss',{duration:2000});
              }
            });
          }
        })
      }      
    }
  }
}
