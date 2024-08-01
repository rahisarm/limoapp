import { Component, EventEmitter, Input, OnInit, Output,OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../services/post.service';
import { HttpClient,HttpHeaders,HttpRequest } from '@angular/common/http';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { getJSON } from 'jquery';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = (form && form.submitted);
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit,OnChanges {
  selectedvalue:string='';
  @Input() labelvalue:string='';
  @Input() placeholder:string='';
  @Input() type:string='';
  @Input() foreignkey:string='';
  @Input() initialoption:string='';
  @Input() disabled:boolean=false;
  cmbfuel = new FormControl('', [Validators.required, Validators.pattern('')]);
  matcher = new MyErrorStateMatcher();
  @Output() valueChange=new EventEmitter();
  errormsg:string='Please select '+this.placeholder;
  optionlist: Array<any> = [];
  constructor(private service:PostService) { }

  ngOnChanges(changes: SimpleChanges): void {
    for(let changename in changes){
      let change=changes[changename];
      
      if(changename==='foreignkey' && this.type=='cardtype'){
        this.getCardType(change.currentValue);
      }
      else if(changename==='foreignkey' && this.type=='location'){
        this.getLocation(change.currentValue);
      }
      else if(changename==='foreignkey' && this.type=='tariff'){
        this.getTariff(change.currentValue);
      }
    }
  }

  disableDropdown(value:boolean){
    if(value){
      this.cmbfuel.disable();
    }
    else{
      this.cmbfuel.enable();
    }
  }
  
  ngOnInit(): void {
    if(this.disabled==true){
      this.cmbfuel.disable();
    }
    else{
      this.cmbfuel.enable();
    }
    if(this.type=='fuel'){
      this.optionlist=[
        {refname: 'Level 0', docno: '0.000'},
        {refname: 'Level 1', docno: '0.125'},
        {refname: 'Level 2', docno: '0.250'},
        {refname: 'Level 3', docno: '0.375'},
        {refname: 'Level 4', docno: '0.500'},
        {refname: 'Level 5', docno: '0.625'},
        {refname: 'Level 6', docno: '0.750'},
        {refname: 'Level 7', docno: '0.875'},
        {refname: 'Level 8', docno: '1.000'}];
    }
    else if(this.type=='invtype'){
      this.optionlist=[
        {refname: 'Month End', docno: '1'},
        {refname: 'Period', docno: '2'}];
    }
    else if(this.type=='branch'){
      this.getBranch();
    }
    else if(this.type=='location'){
      this.getLocation(this.foreignkey);
    }
    else if(this.type=='movtype'){
      this.getMovType();
    }
    else if(this.type=='paytype'){
      this.optionlist=[
        {refname: 'Cash', docno: '1'},
        {refname: 'Card', docno: '2'},
        {refname: 'Cheque/Online', docno: '3'}];
    }
    else if(this.type=='cardtype'){
      console.log('Foreign Key Recieved'+this.foreignkey);
      this.getCardType(this.foreignkey);
    }
    else if(this.type=='inspreftype'){
      this.optionlist=[
        {refname: 'Rental Agreement', docno: 'RAG'},
        {refname: 'Lease Agreement', docno: 'LAG'},
        {refname: 'Replacement', docno: 'RPL'},
        {refname: 'Movement', docno: 'NRM'}];
    }
    else if(this.type=='insptype'){
      this.optionlist=[
        {refname: 'IN', docno: 'IN'},
        {refname: 'OUT', docno: 'OUT'}];
    }
    else if(this.type=='process'){
      this.optionlist=[
        {refname: 'Branch Transfer', docno: '1'},
        {refname: 'Assignment', docno: '2'},
       
      ]
    }
  }
  changeOption(value:string){
    this.valueChange.emit(value);
  }

  async getCardType(cardtype:string){
    this.optionlist=[];
    if(cardtype=='2'){
      await this.service.getCardType().subscribe(response=>{
        let statusarray=new Array();
        Object.values(response).forEach(function(key){
          statusarray.push({'docno':key.docno,'refname':key.refname});
        });
        this.optionlist=statusarray;
      });
    }
    
  }

  async getMovType(){
    this.optionlist=[];
    await this.service.getMovType().subscribe(response=>{
      let statusarray=new Array();
      Object.values(response).forEach(function(key){
        statusarray.push({'docno':key.docno,'refname':key.refname});
      });
      this.optionlist=statusarray;
    });
  }
  async getBranch() {
    await this.service.getBranch().subscribe(response=>{
      for(let i=0;i<response.length;i++){
        this.optionlist.push({refname:response[i].refname,docno:response[i].docno});
      }
    })
  }

  async getLocation(brhid:string){
    if(brhid!='' && brhid!='undefined' && typeof(brhid)!='undefined'){
      this.optionlist=[];
      let locarray=new Array();
      await this.service.getLocation(brhid).subscribe(response=>{
        Object.values(response).forEach(function(key){
          locarray.push({'docno':key.docno,'refname':key.refname});
        });
      });
      this.optionlist=locarray;
    }    
  }

  async getTariff(fleetno:string){
    if(fleetno!='' && fleetno!='undefined' && typeof(fleetno)!='undefined'){
      this.optionlist=[];
      let locarray=new Array();
      await this.service.getTariff(fleetno).subscribe(response=>{
        Object.values(response).forEach(function(key){
          locarray.push({'docno':key.docno,'refname':key.refname});
        });
      });
      this.optionlist=locarray;
    }    
  }
}
