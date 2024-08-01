import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-numericinput',
  templateUrl: './numericinput.component.html',
  styleUrls: ['./numericinput.component.css']
})
export class NumericinputComponent implements OnInit {
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

  ngOnInit(): void {
  }
  setNumeric(value:any){
    this.valueChange.emit(value);
  }
}
