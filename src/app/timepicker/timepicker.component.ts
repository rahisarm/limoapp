import { Component, OnInit, Output,Input,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker/src/app/material-timepicker/models/ngx-material-timepicker-theme.interface';
import { DataService } from '../data.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit,OnChanges {
  time=this.dataservice.getTimeOnly(new Date());
  /*timePickerTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: '#3f51b5',
        buttonColor: '#fff'
    },
    dial: {
        dialBackgroundColor: '#555',
    },
    clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff'
    }
};*/

  @Output() valueChange=new EventEmitter();
  @Input() baseparamtime:string='';  
  @Input() disabled:boolean=false;
  toggleTimePicker = new FormControl('', [Validators.required, Validators.pattern('')]);
  constructor(private dataservice:DataService) {
    
   }


  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.time=changes["baseparamtime"].currentValue;
      
  }
  setTime(basetime:any){
    this.valueChange.emit(basetime);
  }
}
