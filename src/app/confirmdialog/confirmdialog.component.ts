import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmdialogComponent implements OnInit {
  public title:string;
  public message:string;


  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
