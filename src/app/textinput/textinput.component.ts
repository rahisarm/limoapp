import { Component, OnInit,Input,Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.css']
})
export class TextinputComponent implements OnInit,OnChanges {
  textvalue=new FormControl('',this.getValidators());
  @Input() textstatus:number=0;
  @Input() placeholder:string='Enter Value';
  @Output() valueChange=new EventEmitter;
  @Input() labelvalue='Value';
  @Input() disabled:boolean=false;
  @Input() isRequired:boolean=false;
  @Input() isNumeric:boolean=false;
  @Input() initialvalue:string='';
  numericpattern:string='';
  constructor() { }

  ngOnInit(): void {
    if(this.disabled){
      this.textvalue.disable();
    }
    else{
      this.textvalue.enable();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    for(let changename in changes){
      let change=changes[changename];
      if(changename=='isRequired'){
        this.isRequired=change.currentValue;
        this.textvalue = new FormControl('',this.getValidators());
      }
      else if(changename=='initialvalue'){
        this.textvalue = new FormControl(change.currentValue,this.getValidators());
      }
      else if(changename=='isNumeric'){
        this.isNumeric=change.currentValue;
        this.numericpattern='^-?[0-9]+(\.[0-9]+)?$';
        this.textvalue = new FormControl('',this.getValidators());
        
      }
      else if(changename=='disabled'){
        this.disabled=change.currentValue;
        console.log('Text Disabled Change:'+change.currentValue);
        if(this.disabled){
          this.textvalue.disable();
        }
        else{
          this.textvalue.enable();
        }
      }
      else if(changename=='textstatus'){

        this.textstatus=change.currentValue;
      }
    }
  }

  disableInput(value:boolean){
    if(value){
      this.textvalue.disable();
    }
    else{
      this.textvalue.enable();
    }
  }
  setText(value:string){
    this.valueChange.emit(value);
  }

  getValidators(){
    let validators=[];
    if(this.isRequired==true){
      validators.push(Validators.required);
    }
    if(this.isNumeric==true){
      validators.push(Validators.pattern);
    }
    return validators;
  }
}
