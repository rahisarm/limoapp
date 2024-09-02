import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';

@Component({
  selector: 'app-starttrip',
  templateUrl: './starttrip.component.html',
  styleUrls: ['./starttrip.component.css']
})
export class StarttripComponent implements OnInit {

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
  starttripheader:string='Start Trip';
  minkm:number=0;
  starttripstage:number=1;
  kmvalue:any;
  kmerrorstatus:number=0;
  usedkm:number=0;
  bookingno:number=0;
  jobtype:string='';

  constructor( private service:PostService,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService) { 
   
  }

  ngOnInit(): void {
    this.toolbarservice.setData('Start Trip');
    let taskdata=this.dataservice.getTaskData();
    if(taskdata.rdocno=='' || taskdata.rdocno=='undefined' || typeof(taskdata.rdocno)=='undefined'){
      this.starttripheader='Start Trip';
      
    } else {
      this.getTripData(taskdata.rdocno,taskdata.rjobtype);
      this.bookingno=taskdata.rdocno;
    }
  }

  getTripData(data:string,jobstype:string){
    this.service.getStartTripData(data,jobstype).subscribe(response=>{
      this.activetask=response[0];
      this.jobtype=jobstype;
      //console.log(this.starttripstage+"::"+this.activetask.delivery+"::"+this.activetask.collection);
      //this.mindate=new Date(this.activetask.mindate);
      this.starttripheader='Trip #'+this.activetask.bookingno+' '+this.activetask.vehname+' - '+this.activetask.guest+' '+this.activetask.client;
      this.getAutoListValue(this.activetask.fleet,'Fleet');
      //this.minkm=this.activetask.minkm;
    });
  }


  getListValue(basevalue:any,type:string){
    if(type=='Type'){
      this.typevalue=basevalue;
    }
    else if(type=='Fuel'){
      this.fuelvalue=basevalue;
    }
    else if(type=='Branch'){
      this.brhid=basevalue;
    }
    else if(type=='Location'){
      this.locid=basevalue;
    }
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
    this.service.getStartFleetMinData(value).subscribe(response=>{
      this.activetask=response[0];
      this.mindate=new Date(this.activetask.mindate);
      this.minkm=this.activetask.minkm;
      this.kmvalue=this.activetask.minkm;
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
  }
  onSubmit(){
    let errorstatus=0;
    let iskmerror=0;
    if(this.starttripstage==1){
      //console.log("Onsubmit - "+this.activetask.rdocno+" - "+this.activetask.mintime)+" - "+this.activetask.minkm;
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      iskmerror=this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(iskmerror>0 ){
        this._snackbar.open('Please set valid km','Dismiss',{duration:2000});
        return false;
      } 
      if(errorstatus==0){
       // console.log("bookingno - "+this.bookingno);
        let starttripdata={'fleetno':this.fleetvalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'bookingno':this.bookingno,'rjobtype':this.jobtype};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveStartTripInsert(this.dataservice.formatJSONToURL(starttripdata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Trip Successfully Started','Dismiss',{duration:2000});
                this.router.navigate(['/home']);
              }
              else{
                this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              }
            },
            error=>{
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            });
          }
        });
      }
    }
  }
}
