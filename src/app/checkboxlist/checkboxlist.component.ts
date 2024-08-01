import { Component, OnInit,OnChanges,SimpleChanges, Input,Output,EventEmitter,Renderer2 } from '@angular/core';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { Tarifaddon } from '../interface/tarifaddon';
import { MatSelectionList } from '@angular/material/list';
import { MatExpansionPanel} from '@angular/material/expansion';
@Component({
  selector: 'app-checkboxlist',
  templateUrl: './checkboxlist.component.html',
  styleUrls: ['./checkboxlist.component.css']
})
export class CheckboxlistComponent implements OnInit,OnChanges {
  @Input() fleetno:string='';
  @Input() type:string='';
  @Input() docno:string='';
  @Input() rentaltype:string='';
  addonslabel:string='Choose Tariff Addons';
  @Output() onFinalSelection=new EventEmitter();
  data:any[]=[];
  errorstatus:number=0;
  constructor(
    private dataservice:DataService,
    private service:PostService,
    private renderer: Renderer2
  ){
    
  }
  
  ngOnInit(): void {
    //this.data=[{'text':'CDW','name':'cdw','amount':150.00,'selected':0},{'text':'CDW','name':'cdw','amount':150.00,'selected':1}];
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.fleetno!='' && this.docno!='' && this.type=='tariffdetails'){
      this.getTariffDetails(this.fleetno,this.docno,this.rentaltype)
    }
  }

  getTariffDetails(fleetno,tarifdocno,rentaltype){
    this.data=[];
    this.service.getTariffDetails(this.dataservice.formatJSONToURL({'tarifdocno':tarifdocno,'fleetno':fleetno,'rentaltype':rentaltype,'userid':localStorage.getItem('userid')})).subscribe((resp:Tarifaddon[])=>{
      for(const item of resp){
        this.data.push(item);
      }
    });
  }
  onSelected(panel:MatExpansionPanel){
    var selectedItems=[];
    var itemcounter=0;
    for(let i=0;i<this.data.length;i++){
      var item=this.data[i];
      const checkbox=document.getElementById("chk"+i);
      if(checkbox){
        item["checked"]=checkbox['checked'];
        if(checkbox['checked']=='1' || checkbox['checked']==true){
          itemcounter++;
          const rate=parseFloat(item.amount);
          const elmdiscount=document.getElementById("discountvalue"+i);
          item["discount"]=elmdiscount['value'];
          const elmnetamount=document.getElementById("netamount"+i);
          item["netamount"]=elmnetamount['value'];
          selectedItems.push(item);
        }
      }
      this.addonslabel=itemcounter+' Addons Selected';
      panel.close();
      this.onFinalSelection.emit(selectedItems);
    }
    /*const selectedItems= list.selectedOptions.selected.map(option=>option.value);
    var itemcounter=0;
    selectedItems.forEach(item=>{
      itemcounter++;
    });
    this.addonslabel=itemcounter+' Addons Selected';
    panel.close();
    this.onFinalSelection.emit(selectedItems);*/
  }

  onValueChange(event:Event,index:number,item:any){
    var discountvalue=0.0;
    if((event.target as HTMLInputElement).value==''){
      discountvalue=0.0;
    }
    else{
      discountvalue=parseFloat((event.target as HTMLInputElement).value);
    }
    var rate=parseFloat(item.amount);
    var maxdiscount=0.0;
    if(parseFloat(item.discountpercent)>0.0){
      maxdiscount=(parseFloat(item.discountpercent)/100)*rate;
      maxdiscount=parseFloat(maxdiscount.toFixed(2));
    }
    item["maxdiscount"]=maxdiscount;
    if(parseFloat((event.target as HTMLInputElement).value)>maxdiscount){
      this.errorstatus=1;
      (event.target as HTMLInputElement).classList.add('is-invalid');
    }
    else{
      if((event.target as HTMLInputElement).classList.contains('is-invalid')){
        this.renderer.removeClass((event.target as HTMLInputElement),'is-invalid');
      }
      item["netamount"]=rate-discountvalue;
    }
  }
}
