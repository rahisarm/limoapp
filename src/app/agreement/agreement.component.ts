import { Component, OnInit,ViewChild,ViewChildren,QueryList } from '@angular/core';

import { ConfirmdialogService } from '../confirmdialog/confirmdialog.service';
import { DataService } from '../data.service';
import { PostService } from '../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatCheckbox} from '@angular/material/checkbox';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TextinputComponent } from '../textinput/textinput.component';
import { Router } from '@angular/router';
import { ToolbarService } from '../services/toolbar.service';
import { CheckboxlistComponent } from '../checkboxlist/checkboxlist.component';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})

export class AgreementComponent implements OnInit {
  @ViewChild(CheckboxlistComponent) elmCheckboxList:CheckboxlistComponent;
  cldocno:string='';
  initialClient:string='';
  activetask:any={};
  mindate:Date=new Date();
  brhid:string='';
  locid:string='';
  fleetno:string='';
  drvid:string='';
  tariffdocno:string='';
  tarifftype:string='';
  rentaltype:string='';
  tarifaddondata:any[]=[];
  basedate:Date=new Date();
  outdate:Date=new Date();
  baseparamtime:string=this.dataservice.getTimeOnly(new Date());
  outtime:string='';
  deldrvid:string='';
  delchg:number=0.0;
  disableDelivery:boolean=true;
  invalidAmountStatus=0;
  chkdelivery:boolean=false;
  constructor(
    private confirm:ConfirmdialogService,
    private dataservice:DataService,
    private service:PostService,
    private _snackbar:MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private router:Router,
    private toolbar:ToolbarService) { }

  ngOnInit(): void {
    
    if(this.toolbar.getData()!=null && this.toolbar.getData()!='' && this.toolbar.getData()!='undefined'){
      var clientdata=this.toolbar.getData();
      this.cldocno=clientdata['cldocno'];
      this.initialClient=this.cldocno;
    }

    this.SpinnerService.hide();
  }

  getAutoListValue(basevalue:any,basetype){
    this[basetype]=basevalue;
    if(basetype=='fleetno'){
      this.getFleetLastMovDetails(basevalue);
    }
    
  }

  getFleetLastMovDetails(fleetno){
    this.service.getFleetLastMovData(fleetno).subscribe(response=>{
      this.activetask=response;
      console.log(this.activetask);
      this.mindate=new Date(this.activetask.mindate);
    });
  }
  getListValue(basevalue:any,basetype:string){
    this[basetype]=basevalue;
    
    if(basetype=='tariffdocno'){
      this.tariffdocno=basevalue.split(' ')[0];
      this.rentaltype=basevalue.split(' ')[1];
    }
  }
  getDate(basevalue:any,basetype:string){
    this[basetype]=basevalue;
  }
  getTime(basevalue:any,basetype:string){
    this[basetype]=basevalue;
  }

  getTextValue(basevalue:any,basetype:string){
    this[basetype]=basevalue;
  }

  onDeliveryChange(event:any){
    this.chkdelivery=event.checked;
    if(this.chkdelivery==true){
      this.disableDelivery=false;
    }
    else{
      this.disableDelivery=true;
    }
  }
  getCheckboxlistValue(basevalue:any){
    this.tarifaddondata=basevalue;
  }

  onValidateForm(controlArray:any[],chkdelivery:boolean,deldrvid:string,delchg:number){
    let status=true;
    for(let i=0;i<controlArray.length;i++){
      if(controlArray[i]=='' || controlArray[i]==null || controlArray[i]=='undefined' || typeof(controlArray[i])=='undefined'){
        status=false;
        break;
      }
    }
    if(chkdelivery==true){
      if(deldrvid=='' || deldrvid==null || deldrvid=='undefined' || typeof(deldrvid)=='undefined'){
        status=false;
      }
    }
    return status;
  }
  onSubmit(){
    if(this.outtime==''){
      this.outtime=this.baseparamtime;
    }
    let controlArray=[this.cldocno,this.brhid,this.locid,this.fleetno,this.drvid,this.tariffdocno,this.rentaltype];
    console.log('Date & Time Validation');
    console.log([this.activetask.mindate,this.outdate,this.activetask.mintime,this.outtime]);
    var formValid=this.onValidateForm(controlArray,this.chkdelivery,this.deldrvid,this.delchg);
    var errorstatus=0;
    errorstatus=this.dataservice.validateTime(new Date(this.activetask.mindate),this.outdate,this.activetask.mintime,this.outtime);
    if(errorstatus==1){
      formValid=false;
    }
    if(!formValid){
      console.log('Form Invalid');
    }
    if(formValid){
      if(this.tarifaddondata.length==0){
        this._snackbar.open('Please Choose Addons','Dismiss',{duration:2000});
        console.log(this.tarifaddondata);
      }
      else{
        this.confirm.open('Confirmation','Do you want to save changes?').subscribe(result=>{
          if(result){
            this.SpinnerService.show();
            this.service.checkFleetAvailable({'fleetno':this.fleetno,'date':this.dataservice.formatDate(this.outdate),'time':this.outtime}).subscribe((resp)=>{
              //console.log(resp);
              if(resp){
                this.service.saveRentalAgreement({'fleetno':this.fleetno,'brhid':this.brhid,'locid':this.locid,'cldocno':this.cldocno,'drvid':this.drvid,'tarifdocno':this.tariffdocno,'rentaltype':this.rentaltype,'tarifaddons':this.tarifaddondata,'outdate':this.dataservice.formatDate(this.outdate),'outtime':this.outtime,'chkdelivery':this.chkdelivery,'deldrvid':this.deldrvid,'delchg':this.delchg,'basedate':this.dataservice.formatDate(new Date())}).subscribe((response)=>{
                  //console.log(response);
                  if(parseInt(response["agmtdocno"])>0){
                    this.SpinnerService.hide();
                    this._snackbar.open('Agreement #'+response["agmtvocno"]+' Created','Dismiss',{duration:2000});
                    let refdata={'inspecttype':'OUT','fleetno':this.fleetno,'rdocno':response["agmtdocno"],'rdtype':'RAG'};
                    this.service.getInspectDetails(this.dataservice.formatJSONToURL(refdata)).subscribe(inspresp=>{
                      console.log('Inspect Data');console.log(inspresp);
                      this.dataservice.setInspectData(inspresp[0]);
                      this.router.navigate(['/inspection']);
                    });

                    /*this.service.getAppPrintConfig().subscribe(resp=>{
                      if(resp.method=='1'){
                        var printwindow=window.open(this.toolbar.getErpData()+'/com/app/AppPrintRA.action?docno='+response["agmtdocno"]+'&formdetailcode=RAG','_blank');
                        printwindow.print();
                      }
                      else if(resp.method=='2'){
                        var printwindow=window.open(this.toolbar.getErpData()+'/com/operations/agreement/rentalagreement/printRA.action?docno='+response["agmtdocno"]+'&formdetailcode=RAG','_blank');
                        printwindow.print();
                      }
                    });*/
                    //this.toolbar.clearData();
                    //console.log(this.toolbar.getErpData()+'/com/operations/agreement/rentalagreement/printRA.action?docno='+response["agmtdocno"]+'&formdetailcode=RAG');
                    
                    this.router.navigate(['/home']);
                  }
                  else{
                    this.SpinnerService.hide();
                    this._snackbar.open('Agreement Not Saved','Dismiss',{duration:2000});
                    return false;
                  }
                },
                (error)=>{
                  this.SpinnerService.hide();
                  this._snackbar.open('Agreement Not Saved','Dismiss',{duration:2000});
                  return false;
                });
              }
              else{
                this.SpinnerService.hide();
                this._snackbar.open('Fleet Not Available','Dismiss',{duration:2000});
                return false;
              }
            },
            (error)=>{
              this.SpinnerService.hide();
              this._snackbar.open('Fleet Not Available','Dismiss',{duration:2000});
              return false;
            });
          }
        });
      }
      
        
      
      
    }
    
  }
}
