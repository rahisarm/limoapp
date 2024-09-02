import { Component, Input, OnInit, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-numericinput',
  templateUrl: './numericinput.component.html',
  styleUrls: ['./numericinput.component.css']
})
export class NumericinputComponent implements OnInit,OnChanges {
  kmvalue:string='';
  @Input() initialvalue:number=0;
  @Input() kmstatus:number=0;
  @Input() validatevalue:number=0;
  @Input() labelvalue:string='Km';
  @Input() alignstyle:string='';
  @Input() disabled:boolean=false;
  @Output() valueChange=new EventEmitter;
  placeholder='Select '+this.labelvalue;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    for(let changename in changes){
      let change=changes[changename];
      if(changename=='initialvalue' && change.currentValue!=''){
        this.kmvalue = change.currentValue;
      }
    }
  }

  ngOnInit(): void {
  }
  setNumeric(value:any){
    this.valueChange.emit(value);
  }
}
