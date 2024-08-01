import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from './services/post.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  clearTaskData() {
    this.rdocno='';
    this.rdtype='';
    this.tripmode='';
    this.repno='';
    this.date='';
    this.time='';
    this.km='';
    this.fuel='';
  }
  rdocno:any;
  rdtype:any;
  tripmode:any;
  repno:any;
  date:string='';
  time:string='';
  km:string='';
  fuel:string='';
  brhid:string='';
  inspectdocno:string='';
  inspectvocno:string='';
  inspectfleetno:string='';
  inspectrefname:string='';
  inspectbrhid:string='';
  inspectrdtype:string='';
  inspecttype:string='';
  inspectflname:string='';
  constructor(
    private snackbar:MatSnackBar,
    private service:PostService) { }

  setInspectData(element:any){
      this.inspectdocno=element.docno;
      this.inspectvocno=element.vocno;
      this.inspectrefname=element.refname;
      this.inspectfleetno=element.fleetno;
      this.inspectbrhid=element.brhid;
      this.inspecttype=element.inspecttype;
      this.inspectrdtype=element.reftype;
      this.inspectflname=element.flname;
  }
  clearInspectData(){
    this.inspectdocno='';
    this.inspectvocno='';
    this.inspectrefname='';
    this.inspectfleetno='';
    this.inspectbrhid='';
    this.inspecttype='';
    this.inspectrdtype='';
    this.inspectflname='';
}
  getInspectData(){
    return {'inspectrdtype':this.inspectrdtype,'inspectdocno':this.inspectdocno,'inspectvocno':this.inspectvocno,'inspectrefname':this.inspectrefname,'inspectfleetno':this.inspectfleetno,'inspectbrhid':this.inspectbrhid,'inspecttype':this.inspecttype,'inspectflname':this.inspectflname};
  }
  setTaskData(data:any){
    this.rdocno=data.rdocno;
    this.rdtype=data.rdtype;
    this.tripmode=data.tripmode;
    this.repno=data.repno;
    this.date=data.date;
    this.time=data.time;
    this.km=data.km;
    this.fuel=data.fuel;
  }
  getTaskData(){
     return {'rdocno':this.rdocno,'rdtype':this.rdtype,'tripmode':this.tripmode,'repno':this.repno,'date':this.date,'time':this.time,'km':this.km,'fuel':this.fuel};
  }
  getTimeOnly(basedate:Date){
    let basehours=basedate.getHours()+'';
    basehours=basehours.length==1?'0'+basehours:basehours;
    let baseminutes=basedate.getMinutes()+'';
    baseminutes=baseminutes.length==1?'0'+baseminutes:baseminutes;
    return basehours+":"+baseminutes;
  }
  formatDate(date:Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day,month,year].join('.');
}

formatJSONToURL(jsondata:any){
  return  Object.entries(jsondata).map(e => e.join('=')).join('&');
}

validateTime(mindate:Date,curdate:Date,mintime:string,curtime:string){
  let errorstatus=0;
  mindate=new Date(mindate);
  curdate=new Date(curdate);
  mindate.setHours(0,0,0,0);
  curdate.setHours(0,0,0,0);
  const basedate=new Date();
  basedate.setHours(0,0,0,0);
  const basetime=new Date();
  console.log([basedate.toDateString(),curdate.toDateString()]);
  console.log([parseInt(curtime.split(':')[0]),basetime.getHours()]);
  console.log([parseInt(curtime.split(':')[1]),basetime.getMinutes()]);
  if(basedate.toDateString()==curdate.toDateString()){
    if(parseInt(curtime.split(':')[0])>basetime.getHours()){
      errorstatus=1;
      this.snackbar.open('Future Time not allowed','Dismiss',{duration:2000});
      return errorstatus;
    }
    else if(parseInt(curtime.split(':')[0])==basetime.getHours()){
      if(parseInt(curtime.split(':')[1])>basetime.getMinutes()){
        errorstatus=1;
        this.snackbar.open('Future Time not allowed','Dismiss',{duration:2000});
        return errorstatus;
      }
    }
  }
  
  if(mindate.toDateString()==curdate.toDateString()){
    //Checking Hours and minutes
    if(parseInt(curtime.split(':')[0])<parseInt(mintime.split(':')[0])){
      errorstatus=1;
      this.snackbar.open('Selected Time cannot be less than last modified','Dismiss',{duration:2000});
      return errorstatus;
    }
    else if(parseInt(curtime.split(':')[0])==parseInt(mintime.split(':')[0])){
      if(parseInt(curtime.split(':')[1])<parseInt(mintime.split(':')[1])){
        errorstatus=1;
        this.snackbar.open('Selected Time cannot be less than last modified','Dismiss',{duration:2000});
        return errorstatus;
      }
    }
  }
  return errorstatus;
}
  validateKm(curkm:any,minkm:any){
    let errorstatus=0;
    if(curkm=='' || curkm=='undefined' || typeof(curkm)=='undefined'){
      errorstatus=1;
    }
    else if(parseFloat(curkm)<parseFloat(minkm)){
      errorstatus=2;
    }
    return errorstatus;
  }

}
