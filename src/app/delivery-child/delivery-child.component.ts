import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router,RouterStateSnapshot } from '@angular/router';
import { PostService } from '../services/post.service';
import { FormBuilder, FormControl, FormGroup,Validators,AbstractControl } from '@angular/forms';
import { Task as TaskModel} from '../models/task';
import { DataService } from '../data.service';
import { NotificationComponent } from '../notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { SharedService } from '../services/shared.service';
import { ToolbarService } from '../services/toolbar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-delivery-child',
  templateUrl: './delivery-child.component.html',
  styleUrls: ['./delivery-child.component.css'],
  providers:[TaskModel]
})
export class DeliveryChildComponent implements OnInit {
  activetask:any={};
  mindeldate:Date=new Date();
  deldatevalue:Date=new Date();
  deltimevalue:string=this.dataservice.getTimeOnly(new Date());
  delfuelvalue:any;
  delkmvalue:any;
  minkm:number=0;
  kmerrorstatus:number=0;
  usedkm:number=0;
  constructor(
    private formBuilder:FormBuilder,
    private route:ActivatedRoute,
    private service:PostService,
    private dataservice:DataService,
    private _snackbar: MatSnackBar,
    private router:Router,
    private confirm:ConfirmdialogService,
    private sharedservice:SharedService,
    private toolbarservice:ToolbarService,
    private spinner:NgxSpinnerService
    ) { }
  
  ngOnInit(): void {
    this.spinner.show();
    this.toolbarservice.setData('Delivery Update');
    let params=this.dataservice.getTaskData();
    if(params.rdocno!='' && params.rdocno!='undefined' && typeof(params.rdocno)!='undefined'){
      this.getActiveTask(params);
    }
    this.spinner.hide();
  }
  async getActiveTask(params:any){
    await this.service.getActiveTask(params).subscribe(response=>{
      this.activetask=response[0];
      console.log(Object.entries(this.activetask));
      this.mindeldate=new Date(this.activetask.mindate);
      this.minkm=this.activetask.minkm;
    });
  }
  getTime(basetime:any){
    this.deltimevalue=basetime;
  }
  getDate(basedate:any){
    this.deldatevalue=basedate;
  }
  getFuelValue(fuelvalue:string){
    this.delfuelvalue=fuelvalue;
  }
  getKmValue(kmvalue:string){
    this.delkmvalue=kmvalue;
    this.usedkm=this.delkmvalue-this.minkm;
  }
   onSubmit(){
    var errorstatus=0;
    errorstatus=this.dataservice.validateTime(new Date(this.activetask.mindate),this.deldatevalue,this.activetask.mintime,this.deltimevalue)
    this.kmerrorstatus=this.dataservice.validateKm(this.delkmvalue,this.activetask.minkm);
    if(errorstatus==0 && this.kmerrorstatus==0){
      this.confirm.open('Confirmation','Do you want to update data').subscribe(result=>{
        if(result){
          this.spinner.show();
          let deldata={'fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype,'date':this.dataservice.formatDate(this.deldatevalue),'time':this.deltimevalue,'km':this.delkmvalue,'fuel':this.delfuelvalue,'drvdocno':localStorage.getItem('token')};
          this.service.saveAgmtDelivery(this.dataservice.formatJSONToURL(deldata)).subscribe(response=>{
            console.log(response);
            this.spinner.hide();
            if(response==true){
              this._snackbar.open('Agreement Delivery Completed','Dismiss',{duration:2000});
              let tripdata={};
              this.sharedservice.getData().subscribe(data=>{
                tripdata=data;
              })
              this.service.endDriverTrip(this.dataservice.formatJSONToURL(tripdata)).subscribe(resp=>{
                if(resp==true){
                  this._snackbar.open('Trip Ended','Dismiss',{duration:2000});
                  let refdata={'inspecttype':'OUT','fleetno':this.activetask.fleetno,'rdocno':this.activetask.rdocno,'rdtype':this.activetask.rdtype};
                  this.service.getInspectDetails(this.dataservice.formatJSONToURL(refdata)).subscribe((response)=>{
                    this.dataservice.setInspectData(response[0]);
                    this.router.navigate(['/inspection']);
                  });
                }
                else{
                  this._snackbar.open('Trip Not Updated','Dismiss',{duration:2000});
                }
              })
              //this.router.navigate(['/home']);
              
            }
            else{
              this._snackbar.open('Delivery Not Completed','Dismiss',{duration:2000});
              return false;
            }
          },
          error=>{
            this._snackbar.open('Delivery Not Completed','Dismiss',{duration:2000});
            return false;
          });
        }
      })
      
    }
    
  }
}
