import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { TaskdialogComponent } from '../taskdialog/taskdialog.component';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasklist:any=[];
  constructor(
    private spinner:NgxSpinnerService,
    private dataservice:DataService,
    private service:PostService,
    public dialog:MatDialog) { }

  ngOnInit(): void {

    this.getTasks(localStorage.getItem("userid"));

    this.spinner.hide();

  }

  openDialog(task:any){
    const dialogref=this.dialog.open(TaskdialogComponent,{
      data:task
    });
    dialogref.afterClosed().subscribe(resp=>{
      this.getTasks(localStorage.getItem("userid"));
    });
  }

  getTasks(userid:string){
    this.service.getPendingTasks(userid).subscribe(resp=>{
      this.tasklist=resp;
      console.log(this.tasklist);
    })
  }

  loadAssignData(task:any){
    task["taskexist"]=1;
    this.openDialog(task);
  }
}
