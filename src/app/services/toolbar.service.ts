import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  private dataSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public data$:Observable<any>=this.dataSubject.asObservable();

  private APIURLSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public apiurl$:Observable<any>=this.APIURLSubject.asObservable();

  private logonameSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public logoname$:Observable<any>=this.logonameSubject.asObservable();


  private erpSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public erp$:Observable<any>=this.erpSubject.asObservable();


  private fnRefreshTasks=new Subject<void>();
  public fnRefresh$=this.fnRefreshTasks.asObservable();

  constructor() {
    
  }

  setErpData(newData:any){
    this.erpSubject.next(newData);
  }

  getErpData():any{
    return this.erpSubject.value;
  }

  setAPIURLData(newData:any){
    this.APIURLSubject.next(newData);
  }

  getAPIURLData():any{
    return this.APIURLSubject.value;
  }
  setLogonameData(newData:any){
    this.logonameSubject.next(newData);
  }

  getLogonameData():any{
    return this.logonameSubject.value;
  }
  
  setData(newData:any){
    this.dataSubject.next(newData);
  }

  getData():any{
    return this.dataSubject.value;
  }

  clearData() {
    this.dataSubject.next('');
    this.erpSubject.next('');
  }
  onTaskRefresh():void{
    this.fnRefreshTasks.next();
  }
}
