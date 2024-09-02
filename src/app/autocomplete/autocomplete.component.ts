import { Component, OnInit,Input,Output,EventEmitter, SimpleChanges,ViewChild } from '@angular/core';
import { PostService } from '../services/post.service';
import {FormControl, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';

export interface User{
  docno:string,
  refname:string
}
export class MyErrorStateMatcher implements MyErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
};
 
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})

export class AutocompleteComponent implements OnInit {
  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  @Input() labelvalue:string='';
  @Input() paramtype:string='';
  @Input() paramreftype:string='';
  @Input() parambrhid:string='';
  @Input() paramfleetno:string='';
  @Input() type:string='movfleet';
  @Output() valueChange=new EventEmitter();
  @Input() paramrefno:string='';
  @Input() isRequired:boolean=false;

  myForm:FormGroup;
  myControl = new FormControl<string | User>('',this.getValidators());
  myErrorStateMatcher = new MyErrorStateMatcher();
  isloading:number=0;
  options: User[] =[];
  @Input() disabled:boolean=false;
  
  //{docno:'1',refname: 'Toyota Supra Mk4'}, {docno:'2',refname: 'Nissan Skyline GTR'}, {docno:'3',refname: 'VW Golf GT Mk2'}];
  filteredOptions: Observable<User[]>;
  @Input() initialValue:string;
  selectedOption:User;
  constructor(private service:PostService){
    
  }
  getValidators(){
    let validators = [];
    if(this.isRequired){
      validators.push(Validators.required);
    }
    return validators;
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    for(let changename in changes){
      let change=changes[changename];
      if(changename=='paramtype'){
        this.paramtype=change.currentValue;
      }
      else if(changename=='paramreftype'){
        this.paramreftype=change.currentValue;
      }
      else if(changename=='parambrhid'){
        this.parambrhid=change.currentValue;
      }
      else if(changename=='paramfleetno'){
        this.paramfleetno=change.currentValue;
      }
      else if(changename=='paramrefno'){
        this.paramrefno=change.currentValue;
      }
      else if(changename=='isRequired'){
        this.isRequired=change.currentValue;
        this.myControl = new FormControl<string | User>('',this.getValidators());
        this.myErrorStateMatcher = new MyErrorStateMatcher();
      }
      else if(changename=='initialValue'){
        this.initialValue=change.currentValue;
      }
      else if(changename=='disabled'){
        if(change.currentValue==true){
          this.myControl.disable();
        }
        else{
          this.myControl.enable();
        }
      }
    }

    if(this.type=='insprdocno'){
      let datalist=this.options=[];
      if(this.paramtype!='' && this.paramreftype!='' && this.parambrhid!='' && this.paramfleetno!=''){
        this.isloading=1;
        var params='type='+this.paramtype+'&reftype='+this.paramreftype+'&brhid='+this.parambrhid+'&fleetno='+this.paramfleetno;
        console.log('Insp Ref Docs:'+params);
        this.service.getInspRefDoc(params).subscribe(response=>{
          Object.values(response).forEach(function(key){
            datalist.push({docno:key.docno,refname:key.refname});
          });
          this.options=datalist;
          this.loadFn();
        });
      }
    }
    else if(this.type=='rrfleet'){
      let datalist=this.options=[];
      if(this.parambrhid!=''){
        this.isloading=1;
        this.service.getRentalReadyFleet(this.parambrhid).subscribe(response=>{
          Object.values(response).forEach(function(key){
            datalist.push({docno:key.docno,refname:key.refname});
          });
          this.options=datalist;
          this.loadFn();
        });
      }
    }
    else if(this.type=='clientdriver'){
      let datalist=this.options=[];
      if(this.paramrefno!=''){
        this.isloading=1;
        this.service.getClientDriver(this.paramrefno).subscribe(response=>{
          Object.values(response).forEach(function(key){
            datalist.push({docno:key.docno,refname:key.refname});
          });
          this.options=datalist;
          this.loadFn();
        });
      }
    }
    else if(this.type=='compdriver'){
      this.isloading=1;
      let datalist=this.options=[];
      this.service.getCompanyDriver().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    
  }
  ngOnInit() {
    let datalist=this.options=[];
    console.log('Disabled Initially:'+this.disabled);
    if(this.disabled==true){
      this.myControl.disable();
    }
    if(this.type=='movfleet'){
      this.isloading=1;
      this.service.getMovementFleet().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    else if(this.type=='movgarage'){
      this.isloading=1;
      this.service.getMovementGarage().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    else if(this.type=='client'){
      this.isloading=1;
      this.service.getClient('').subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    else if(this.type=='inspfleet'){
      this.isloading=1;
      this.service.getInspFleet().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    else if(this.type=='compdriver'){
      this.isloading=1;
      this.service.getCompanyDriver().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }
    else if(this.type=='jobno'){
      this.isloading=1;
      this.service.getjobs().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.bookingno,refname:key.jobno});
         // console.log(datalist)
        });
        this.options=datalist;
        this.loadFn();
      })
    } 
    else if(this.type=='jobassignment'){
      this.isloading=1;
      this.service.getjobsforassignment().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.jobno});
         // console.log(datalist)
        });
        this.options=datalist;
        this.loadFn();
      })
    }
    else if(this.type=='user'){
      this.isloading=1;
      this.service.getUser().subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
         // console.log(datalist)
        });
        this.options=datalist;
        this.loadFn();
      })
    }
    
  }

  loadFn(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        console.log(value+'::loadFn');
        const refname = typeof value === 'string' ? value : value?.refname;
        return refname ? this._filter(refname as string).slice(0,100) : this.options.slice(0,100);
      }),
    );
    
    if(this.initialValue!=null && this.initialValue!='undefined' && typeof(this.initialValue)!='undefined'){
      const initialOption=this.options.find(user=>user.docno==this.initialValue);
      this.selectedOption=initialOption;
      this.valueChange.emit(this.initialValue);
    }
    this.isloading=0;
  }
  displayFn(user: User): string {
    return user && user.refname ? user.refname : '';
  }

  selectedFn(evt){
    this.valueChange.emit(evt.option.value.docno);
  }
  private _filter(refname: string): User[] {
    const filterValue = refname.toLowerCase();
    return this.options.filter(option => option.refname.toLowerCase().includes(filterValue));
  }
  public trackByFunction(index,item){
    if(!item) return null;
    return item.docno;
  }
  /* selectOption(optionValue: string): void {
    const selectedOption = this.autocomplete.options.find(option => option.value === optionValue);
    if (selectedOption) {
      this.autocomplete.optionSelected.emit({ option: selectedOption });
      this.autocompleteTrigger.writeValue(selectedOption.value);
    }
  } */

  getBulkData(evt:any){
    /*let datalist=this.options=[];
    if(this.type=='client'){
      this.isloading=1;
      this.service.getClient((evt.target as HTMLInputElement).value).subscribe(response=>{
        Object.values(response).forEach(function(key){
          datalist.push({docno:key.docno,refname:key.refname});
        });
        this.options=datalist;
        this.loadFn();
      });
    }*/
  }
}
