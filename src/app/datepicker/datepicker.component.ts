import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

class PickDateAdapter extends NativeDateAdapter {
  
  override format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd.MM.yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})

export class DatepickerComponent implements OnInit {
  @Input() minDate:Date=new Date();
  @Input() maxDate:Date=new Date();
  @Input() allowFutureDate:number=0;
  @Input() placeholder:string='Choose a date';
  @Input() allowBackDate:number=0;
  @Input() disabled:boolean=false;
  @Output() dateValueChange=new EventEmitter();
  constructor() {
  }
  defaultdate=new Date();
  ngOnInit(): void {
    if(this.allowFutureDate==1){
      this.maxDate=null;
    }
    if(this.allowBackDate==1){
      this.minDate=null;
    }
  }
  setDate(basedate:any){
    //console.log('changed date value:'+Object.entries(basedate).map(e => e.join('=')).join('&'));
    this.dateValueChange.emit(basedate.value);
  }

  onInputBlur(){
    console.log('Blur Date'+this.defaultdate);
  }
}
