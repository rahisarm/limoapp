import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import { HttpClient,HttpHeaders,HttpRequest } from '@angular/common/http';
import { Task as TaskModel} from '../models/task'
import { from,Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { RouterAnimation } from '../animations/router.animation';
import { Router,ActivatedRoute} from '@angular/router';
import { DataService } from '../data.service';
import { FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass,faCar} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";  
import { SharedService } from '../services/shared.service';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { ToolbarService } from '../services/toolbar.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    RouterAnimation.routeSlide
  ],
  providers:[PostService]
})


export class HomeComponent implements OnInit {
  tasklist:any;
  drivername:string=''
  driverdetail:string='';
  filtertext:string='';
  pageTitle:string='Home'
  jobcount:number=0;
  movcount:number=0;
  delcount:number=0;
  collectcount:number=0;
  unfilterlist:any;
  notripfound:number=0;
  taskcount:number=0;
  isActive:string='ALL';
  bgpath:string=environment.imgpath;
  driverFound:number=0;
  hidden:boolean=false;
  constructor(
    private dataservice:DataService,
    private service:PostService,
    private router:Router,
    private activeRoute:ActivatedRoute,
    private _snackbar:MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private confirmdialogService:ConfirmdialogService,
    private sharedService:SharedService,
    private toolbarservice:ToolbarService,
    library:FaIconLibrary) {
      library.addIcons(faMagnifyingGlass,faCar)
     }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.toolbarservice.setData('Home');
    this.service.getGlobalData().subscribe(resp=>{
      this.toolbarservice.setErpData(resp[0].erporigin);
    });
    this.toolbarservice.fnRefresh$.subscribe(()=>{
      this.onRefreshPage();
    });
    this.service.getDriver().subscribe(response=>{
      console.log(response);
      if(response.length>0){
        this.drivername=response[0].drivername;
        this.driverdetail=response[0].driverdetail;
        this.driverFound=1;
      }
      // changed this section to handle long if driver is not found 
      else{
        this.SpinnerService.hide();
        this._snackbar.open('Driver Not Found','Dismiss',{duration:2000});    
        this.router.navigate(['/login']);
      }
    });
    

    this.service.getTasks()
        .subscribe(response => {
          console.log("get task response - "+response);
          this.tasklist = response;
          this.movcount=0;
          this.jobcount=0;
          this.delcount=0;
          this.collectcount=0;
          this.tasklist.forEach(element => {
            if(element.tripmode=='Collection'){
              this.collectcount++;
            }
            else if(element.tripmode=='Delivery'){
              this.delcount++;
            }
            else if(element.tripmode=='Job Assigned'){
              this.jobcount++;
            }
            else if(element.tripmode=='Transfer Branch Close' || element.tripmode=='Garage Collection' || element.tripmode=='Garage Delivery' || element.tripmode=='Garage Branch Close'){
              this.movcount++;
            }
          });
          this.isActive='ALL';
          this.unfilterlist=this.tasklist;
          if(this.tasklist.length==0){
            this.notripfound=1;
          }
          else{
            this.notripfound=0;
          }
          this.SpinnerService.hide();
        });
        console.log('Tasks');
        console.log(this.tasklist);
  }

  onSelectStats(code:string){
    var tripmodearray=[];
    if(code=='DEL'){
      tripmodearray.push('Delivery');
      this.isActive='DEL';
    }
    else if(code=='COL'){
      tripmodearray.push('Collection');
      this.isActive='COL';
    }
    else if(code=='JOB'){
      tripmodearray.push('Job Assigned');
      this.isActive='JOB';
    }
    else if(code=='MOV'){
      tripmodearray.push('Transfer Branch Close');
      tripmodearray.push('Garage Collection');
      tripmodearray.push('Garage Delivery');
      tripmodearray.push('Garage Branch Close');
      this.isActive='MOV';
    }
    else if(code=='ALL'){
      this.isActive='ALL';
    }
    if(this.isActive=='DEL' || this.isActive=='COL' || this.isActive=='JOB' || this.isActive=='MOV'){
      this.tasklist=this.unfilterlist.filter(task=>tripmodearray.includes(task.tripmode));
    }
    else if(this.isActive=='ALL'){
      this.tasklist=this.unfilterlist;
    }
    if(this.tasklist.length==0){
      this.notripfound=1;
    }
    else{
      this.notripfound=0;
    }
  }
  onRefreshPage(){
    this.movcount=0;
    this.jobcount=0;
    this.delcount=0;
    this.collectcount=0;
    this.SpinnerService.show();
    this.service.getTasks()
      .subscribe(response => {
        this.tasklist = response;
        this.tasklist.forEach(element => {
          if(element.tripmode=='Collection'){
            this.collectcount++;
          }
          else if(element.tripmode=='Delivery'){
            this.delcount++;
          }
          else if(element.tripmode=='Job Assigned'){
            this.jobcount++;
          }
          else if(element.tripmode=='Transfer Branch Close' || element.tripmode=='Garage Collection' || element.tripmode=='Garage Delivery' || element.tripmode=='Garage Branch Close'){
            this.movcount++;
          }
        });
        this.unfilterlist=this.tasklist;
        this.isActive='ALL';
        if(this.tasklist.length==0){
          this.notripfound=1;
        }
        else{
          this.notripfound=0;
        }
        this.SpinnerService.hide();
      });
  }

  onTaskSelect(task:any){
    console.log(task);
    if(task.tripmode=="Job Assigned" && task.drvtripstatus==0){
      this.confirmdialogService.open('Confirmation','Are you sure to start the trip ?').subscribe(result=>{
        if(result){
          this.onSelectLimoJob(task);
        } else {
          this.router.navigate(['/home']);
        } 
      })
    } else if(task.tripmode=="Job Assigned" && task.drvtripstatus==1){
      this.confirmdialogService.open('Confirmation','Are you sure to end the trip ?').subscribe(result=>{
        if(result){
          this.onSelectLimoJob(task);
        } else {
          this.router.navigate(['/home']);
        } 
      })
    } else if(task.drvtripstatus!=1 && task.tripmode!="Job Assigned"){
      this.onDriverTripStart(task);
    } else if(task.drvtripstatus==1 && task.tripmode!="Job Assigned"){
      this.funUpdateDel(task);
    }
  }

  onSelectLimoJob(task:any){    
        this.funUpdateDel(task);
  }

  onDriverTripStart(task:any){
    var curdate=this.dataservice.formatDate(new Date()),curtime=this.dataservice.getTimeOnly(new Date());
    this.confirmdialogService.open('Confirmation','Are you sure to start the trip on '+curdate+' '+curtime).subscribe(result=>{
      if(result){
        this.SpinnerService.show();
        let drvdata={'rdocno':task.rdocno,'rdtype':task.rdtype,'driverdocno':localStorage.getItem('token')};
        this.service.startDriverTrip(this.dataservice.formatJSONToURL(drvdata)).subscribe(response=>{
          console.log(response);
          if(response==true){
            this._snackbar.open('Trip Started Successfully','Dismiss',{duration:2000});
            this.onRefreshPage();
          }
          else{
            this._snackbar.open('Not Updated','Dismiss',{duration:2000,panelClass:['error-snackbar']});
          }
          this.SpinnerService.hide();
        })
      }
    })
  }

  funUpdateDel(task:any){
    this.dataservice.setTaskData({'rdocno':task.rdocno,'rdtype':task.rdtype,'tripmode':task.tripmode,'repno':task.repno});
    this.sharedService.setData({'rdocno':task.rdocno,'rdtype':task.rdtype,'driverdocno':localStorage.getItem('token')});
    if(parseInt(task.repno)>0 && task.tripmode!='Collection'){
      this.router.navigate(['/replacement']);  
    }
    else if(task.rdtype=='MOV'){
      this.router.navigate(['/movement']);
    }
    else if(task.tripmode=='Collection'){
      this.router.navigate(['/collection']);
    } else if(task.tripmode=='Job Assigned'){
      task.drvtripstatus==1?this.router.navigate(['/endtrip']):this.router.navigate(['/starttrip']);
    } else {
      this.router.navigate(['/delivery-child'],{relativeTo:this.activeRoute});
    }
  }

  
  onCreateClient(){
    
  }
}
