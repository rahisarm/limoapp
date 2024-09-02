import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-taskdialog',
  templateUrl: './taskdialog.component.html',
  styleUrls: ['./taskdialog.component.css']
})
export class TaskdialogComponent implements OnInit {

  refno:string='';
  cmbtype:string='';
  datevalue:Date=new Date();
  mindate:Date=new Date();
  refnoerrorstatus:number=0;
  remarkserrorstatus:number=0;
  cmbstatus:string='';
  user:string='';
  remarks:string='';
  taskexist:number=0;
  docno:number=0;
  constructor(
    private spinner:NgxSpinnerService,
    private confirm:ConfirmdialogService,
    private dataservice:DataService,
    private _snackbar:MatSnackBar,
    private service:PostService,
    public dialogref:MatDialogRef<TaskdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public taskdata:any
  ) { 
    
  }

  ngOnInit(): void {
    if(this.taskdata!=null && this.taskdata!=''){
      this.refno=this.taskdata.refNo;
      this.remarks=this.taskdata.desc;
      this.datevalue=this.taskdata.edcDate;
      this.cmbtype=this.taskdata.reftypedocno;
      this.taskexist=this.taskdata.taskexist;
      this.docno=this.taskdata.doc_no;
      this.cmbstatus=this.taskdata.status;
    }
  }
  
  onCancelDialog(){
    this.dialogref.close();
  }

  onSave(form:NgForm){
    
    if(this.cmbtype=='' || this.cmbstatus=='' || this.user==''){
      return false;
    }
    
    if(this.cmbstatus!='Assigned' && (this.user!=localStorage.getItem('userid'))){
      this._snackbar.open('Only assign it to logged user','Dismiss',{duration:2000});
      return false;
    }
    this.confirm.open('Confirmation','Do you want to update changes?').subscribe(resp=>{
      
      if(resp){
        var basedate=new Date();
        var basetime=this.dataservice.getTimeOnly(basedate);
        var formattedDate=this.dataservice.formatDate(basedate);
        var taskitem={'docno':this.docno,'taskstatus':this.cmbstatus,'refType':this.cmbtype,'refNo':this.refno,'startDate':formattedDate,'startTime':basetime,'hidUser':this.user,'desc':this.remarks,'userId':localStorage.getItem('userid'),'edcDate':this.dataservice.formatDate(this.datevalue)};
        if(this.taskexist==1){
          this.service.reAssignTask(this.dataservice.formatJSONToURL(taskitem)).subscribe(rsp=>{
            if(rsp){
              this._snackbar.open('Task Saved Successfully','Dismiss',{duration:2000});
              this.dialogref.close();
            }
            else{
              this._snackbar.open('Task Not Saved','Dismiss',{duration:2000});
            }
          })
        }
        else{
          this.service.addTask(this.dataservice.formatJSONToURL(taskitem)).subscribe(rsp=>{
            if(rsp){
              this._snackbar.open('Task Saved Successfully','Dismiss',{duration:2000});
              this.dialogref.close();
            }
            else{
              this._snackbar.open('Task Not Saved','Dismiss',{duration:2000});
            }
          })
        }
        
      }
    });
  }

  getValue(value:any,type:string){
    this[type]=value;
  }
}
