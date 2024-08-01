import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.css']
})
export class MovementComponent implements OnInit {
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
  movheader:string='Create Movement';
  minkm:number=0;
  movstage:number=1;
  kmvalue:any;
  kmerrorstatus:number=0;
  usedkm:number=0;
  constructor(
    private service:PostService,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private toolbarservice:ToolbarService
    ) { }

  ngOnInit(): void {
    this.toolbarservice.setData('Create Movement');
    let taskdata=this.dataservice.getTaskData();
    //console.log('Loaded '+taskdata.rdocno);
    if(taskdata.rdocno=='' || taskdata.rdocno=='undefined' || typeof(taskdata.rdocno)=='undefined'){
      this.movheader='Create Movement';
    }
    else{
      //this.movheader='Movement #'+taskdata.rdocno+;
      this.getMovExistData(taskdata.rdocno);
    }
  }
  getMovExistData(data:string){
    this.service.getMovExistData(data).subscribe(response=>{
      this.movstage++;
      this.activetask=response[0];
    //  console.log(this.activetask);
    //  console.log(this.movstage+"::"+this.activetask.delivery+"::"+this.activetask.collection);
      this.mindate=new Date(this.activetask.mindate);
      this.movheader='Movement #'+this.activetask.docno+' '+this.activetask.flname;
      this.minkm=this.activetask.minkm;
      /*let inspectdata={'fleetno':this.activetask.fleetno,'rdocno':this.activetask.docno,'rdtype':'NRM','inspecttype':'IN'};
      this.dataservice.setInspectData(inspectdata);*/
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
    this.service.getMovFleetMinData(value).subscribe(response=>{
      this.activetask=response[0];
     // console.log(this.activetask.mindate);
      this.mindate=new Date(this.activetask.mindate);
     // console.log(this.activetask);
      this.minkm=this.activetask.minkm;
    });
  }

  onSubmit(){
    let errorstatus=0;
    if(this.movstage==1){
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      //this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(this.typevalue=='' || this.typevalue=='undefined' || typeof(this.typevalue)=='undefined'){
          this._snackbar.open('Please select type','Dismiss',{duration:2000});
          errorstatus=1;
          return false;
      }
      if(errorstatus==0){
        //Saving Movement
        let movdata={'fleetno':this.fleetvalue,'type':this.typevalue,'garageid':this.garagevalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.activetask.minkm,'fuel':this.activetask.minfuel,'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'trancode':this.activetask.trancode};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveMovInsert(this.dataservice.formatJSONToURL(movdata)).subscribe(response=>{
             // console.log('Movement Insert'+response);
              if(response==true){
                this._snackbar.open('Movement Successfully Saved','Dismiss',{duration:2000});
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
    else if(this.activetask.movtype=='TR'){
      //Closing Transfer
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.kmerrorstatus==0){
        let movdata={'docno':this.activetask.docno,'fleetno':this.activetask.fleetno,'type':this.activetask.movtype,'garageid':this.garagevalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'fuel':this.fuelvalue,'brhid':this.brhid,'locid':this.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'trancode':this.activetask.trancode};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          this.service.closeMovTransfer(this.dataservice.formatJSONToURL(movdata)).subscribe(response=>{
            if(response==true){
              this._snackbar.open('Movement Successfully Closed','Dismiss',{duration:2000});
              let tripdata={'rdocno':this.activetask.docno,'rdtype':'MOV',driverdocno:localStorage.getItem('token')};
              this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(rsp=>{
                if(rsp==true){
                  this._snackbar.open('Trip ended','Dismiss',{duration:2000});    
                  this.router.navigate(['/home']);
                }
                else{
                  this._snackbar.open('Trip not updated','Dismiss',{duration:2000});    
                }
              })
            }
            else{
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            }
          },
          error=>{
            this._snackbar.open('Not Saved','Dismiss',{duration:2000});
          });
        });
        
      }
    }
    else if((this.activetask.movtype=='GS' || this.activetask.movtype=='GM' || this.activetask.movtype=='GA') && this.activetask.delivery=='0'){
        //Saving Delivery
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.kmerrorstatus==0){
        let movdata={'docno':this.activetask.docno,'fleetno':this.activetask.fleetno,'type':this.activetask.movtype,'garageid':this.garagevalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'fuel':this.fuelvalue,'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'trancode':this.activetask.trancode};
        this.confirm.open('Confirmation','Do you want to update changes').subscribe(resp=>{
          if(resp){
            this.service.saveMovDelivery(this.dataservice.formatJSONToURL(movdata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Movement Delivery Created','Dismiss',{duration:2000});
                let tripdata={'rdocno':this.activetask.docno,'rdtype':'MOV',driverdocno:localStorage.getItem('token')};
                this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(rsp=>{
                  if(rsp==true){
                    this._snackbar.open('Trip ended','Dismiss',{duration:2000});    
                    this.router.navigate(['/home']);
                  }
                  else{
                    this._snackbar.open('Trip not updated','Dismiss',{duration:2000});    
                  }
                })
              }
              else{
                this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              }
            },
            error=>{
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            });
          }
        })
        
      }
    }
    else if((this.activetask.movtype=='GS' || this.activetask.movtype=='GM' || this.activetask.movtype=='GA') && this.activetask.delivery=='1' && this.activetask.collection=='0'){
      //Saving Collection
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.kmerrorstatus==0){
        let movdata={'docno':this.activetask.docno,'fleetno':this.activetask.fleetno,'type':this.activetask.movtype,'garageid':this.garagevalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'fuel':this.fuelvalue,'brhid':this.activetask.brhid,'locid':this.activetask.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'trancode':this.activetask.trancode};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveMovCollection(this.dataservice.formatJSONToURL(movdata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Movement Collection Created','Dismiss',{duration:2000});
                let tripdata={'rdocno':this.activetask.docno,'rdtype':'MOV',driverdocno:localStorage.getItem('token')};
                this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(rsp=>{
                  if(rsp==true){
                    this._snackbar.open('Trip ended','Dismiss',{duration:2000});    
                    this.router.navigate(['/home']);
                  }
                  else{
                    this._snackbar.open('Trip not updated','Dismiss',{duration:2000});    
                  }
                })
              }
              else{
                this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              }
            },
            error=>{
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            });
          }
        })
        
      }
    }
    else if((this.activetask.movtype=='GS' || this.activetask.movtype=='GM' || this.activetask.movtype=='GA') && this.activetask.delivery=='1' && this.activetask.collection=='1'){
      //Saving Garage Branch Close
      errorstatus=this.dataservice.validateTime(this.activetask.mindate,this.datevalue,this.activetask.mintime,this.timevalue);
      this.kmerrorstatus=this.dataservice.validateKm(this.kmvalue,this.activetask.minkm);
      if(errorstatus==0 && this.kmerrorstatus==0){
        let movdata={'docno':this.activetask.docno,'fleetno':this.activetask.fleetno,'type':this.activetask.movtype,'garageid':this.garagevalue,'basedate':this.dataservice.formatDate(new Date()),'date':this.dataservice.formatDate(this.datevalue),'time':this.timevalue,'km':this.kmvalue,'fuel':this.fuelvalue,'brhid':this.brhid,'locid':this.locid,'drvdocno':localStorage.getItem('token'),'userid':localStorage.getItem('userid'),'remarks':this.remarks,'trancode':this.activetask.trancode};
        this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
          if(resp){
            this.service.saveMovGarageBranchClose(this.dataservice.formatJSONToURL(movdata)).subscribe(response=>{
              if(response==true){
                this._snackbar.open('Movement Closed','Dismiss',{duration:2000});
                let tripdata={'rdocno':this.activetask.docno,'rdtype':'MOV',driverdocno:localStorage.getItem('token')};
                this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(rsp=>{
                  if(rsp==true){
                    this._snackbar.open('Trip ended','Dismiss',{duration:2000});    
                    this.router.navigate(['/home']);
                  }
                  else{
                    this._snackbar.open('Trip not updated','Dismiss',{duration:2000});    
                  }
                })
              }
              else{
                this._snackbar.open('Not Saved','Dismiss',{duration:2000});
              }
            },
            error=>{
              this._snackbar.open('Not Saved','Dismiss',{duration:2000});
            });
          }
        })
        
      }
    }
  }
}
