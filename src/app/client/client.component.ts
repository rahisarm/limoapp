import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToolbarService } from '../services/toolbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  basemindate:Date=new Date();
  clientname:string='';
  mobileno:string='';
  emailid:string='';
  licenseno:string='';
  licenseissued:string='';
  visano:string='';
  visaissued:string='';
  dob:Date=new Date();
  licenseexpiry:Date=new Date();
  visaexpiry:Date=new Date();
  chkadvance:boolean=false;
  invtype:string='';
  clientnamestatus:number=0;
  mobilenostatus:number=0;
  emailidstatus:number=0;
  licensenostatus:number=0;
  licenseissuedstatus:number=0;
  visanostatus:number=0;
  visaissuedstatus:number=0;
  passportno:string='';
  passportexpiry:Date=new Date();
  passportnostatus:number=0;
  isSubmitted:boolean=false;
  restrictAgmt:boolean=false;
  constructor(
    private toolbarservice:ToolbarService,
    private confirm:ConfirmdialogService,
    private dataservice:DataService,
    private service:PostService,
    private _snackbar:MatSnackBar,
    private SpinnerService:NgxSpinnerService,
    private router:Router) { 
    
  }

  ngOnInit(): void {
    this.toolbarservice.setData('Create Client');
    this.service.getConfigData("appHideCreateAgmt").subscribe(resp=>{
      if(resp.length>0){
        var hideconfig=resp[0].docno;
        if(hideconfig=="1" || hideconfig==1){
          this.restrictAgmt=true;
        }
      }
    });
    this.SpinnerService.hide();
  }

  getTextValue(basevalue:any,basetype:string){
    this[basetype]=basevalue;
  }

  getDate(basedate:any,basetype:string){
    this[basetype]=basedate;
  }
  getListValue(basevalue:any,basetype:string){
    this[basetype]=basevalue;
  }

  onCheckboxChange(event:any){
    this.chkadvance=event.checked;
  }
  onSubmit(){
    if(this.clientname==''){
      this.clientnamestatus=1;
      return false;
    }
    else{
      this.clientnamestatus=0;
    }
    if(this.mobileno==''){
      this.mobilenostatus=1;
      return false;
    }
    else{
      this.mobilenostatus=0;
    }
    /*if(this.emailid==''){
      this.emailidstatus=1;
      return false;
    }
    else{
      this.emailidstatus=0;
    }*/
    if(this.licenseno==''){
      this.licensenostatus=1;
      return false;
    }
    else{
      this.licensenostatus=0;
    }
    if(this.licenseissued==''){
      this.licenseissuedstatus=1;
      return false;
    }
    else{
      this.licenseissuedstatus=0;
    }

    let clientdata={'clientname':this.clientname,'mobileno':this.mobileno,'email':this.emailid,'dob':this.dataservice.formatDate(this.dob),'licenseno':this.licenseno,'licenseissued':this.licenseissued,'licenseexpiry':this.dataservice.formatDate(this.licenseexpiry),'visano':this.visano,'visaissued':this.visaissued,'visaexpiry':this.dataservice.formatDate(this.visaexpiry),'invtype':this.invtype,'advance':this.chkadvance,'passportno':this.passportno,'passportexpiry':this.dataservice.formatDate(this.passportexpiry)};
    console.log(clientdata);
    this.confirm.open('Confirmation','Do you want to save changes?').subscribe(resp=>{
      if(resp){
        this.SpinnerService.show();
        this.service.saveClient(clientdata).subscribe((response)=>{
          console.log(response);
          if(parseInt(response.toString())>0){
            this.SpinnerService.hide();
            var cldocno=parseInt(response.toString());
            this._snackbar.open('Client Created','Dismiss',{duration:2000});
            if(this.restrictAgmt==false){
              this.confirm.open('Confirmation','Do you want to create Agreement?').subscribe(res=>{
                if(res){
                  this.toolbarservice.setData({'cldocno':cldocno});
                  this.router.navigate(['/agreement']);
                }
              });
            }
            else{
              this.router.navigate(['/home']);
            }
            
          }
          else{
            this.SpinnerService.hide();
            this._snackbar.open('Not Updated','Dismiss',{duration:2000});
            return false;
          }  
        },
        (error) => {
          this.SpinnerService.hide();
          this._snackbar.open('Not Updated','Dismiss',{duration:2000});
          return false;
        });
      }
      
    })

  }
  
}
