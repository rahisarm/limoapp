import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';   
import { catchError, map} from 'rxjs/operators'
import { environment } from '../../environments/environment';
import { Task } from '../models/task';
import { Tarifaddon } from '../interface/tarifaddon';
import { ToolbarService } from './toolbar.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  public API_URL:string=environment.baseUrl;
  public initialised:boolean=false;
  public rdocno:any;
  public rdtype:any;
  public tripmode:any;
  httpOptions = {
    headers : new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
    responseType:'json' as const
  };
  httpOptionsJSON = {
    headers : new HttpHeaders({'Content-Type': 'application/json'}),
    responseType:'json' as const
  };
  //public API_URL=this.toolbarservice.getAPIURLData
  constructor(private httpClient: HttpClient,private toolbarservice:ToolbarService) { 
    //this.initialiseFn();
  }

  initialiseFn(){
    console.log(this.initialised);
    if(!this.initialised){
      this.httpClient.get('assets/config.json').subscribe((resp:any)=>{
        console.log('API:'+resp.apiurl);
        this.API_URL=resp.apiurl;
        this.initialised=true;
      })
    }
  }

   getConfigData(configname:string){
    let url=this.API_URL+'/getConfigData?configname='+configname;
    return this.httpClient.get<any>(url,this.httpOptions);
  }

  getReplacementData(params:any){
    let driverdocno=localStorage.getItem('token');
    let url=this.API_URL+'/getReplacementData?rdocno='+params.rdocno+'&rdtype='+params.rdtype+'&tripmode='+params.tripmode+'&repno='+params.repno;
    return this.httpClient.get<any>(url,this.httpOptions);
  }
  getAppPrintConfig(){
    let url=this.API_URL+'/getAppPrintConfig';
    return this.httpClient.get<any>(url,this.httpOptions);
  }
  getPickupData(pickupdocno:any){
    let driverdocno=localStorage.getItem('token');
    let url=this.API_URL+'/getPickupData?docno='+pickupdocno;
    return this.httpClient.get<any>(url,this.httpOptions);
  }

  getInspLatestFleetData(fleetno:any){
    let driverdocno=localStorage.getItem('token');
    let url=this.API_URL+'/getInspLatestFleetData?fleetno='+fleetno;
    return this.httpClient.get<any>(url,this.httpOptions);
  }
  setImagePath(imagepath: any) {
    let imagesrc='';
    this.httpClient.get(imagepath, { responseType: 'blob' })
    .subscribe(response => {
      const reader = new FileReader();
      reader.onload = () => {
        imagesrc = reader.result as string;
      };
      reader.readAsDataURL(response);
    });

    return imagesrc;
  }
    
    startDriverTrip(data:string){
      let url=this.API_URL+'/startDriverTrip?'+data;
      return this.httpClient.post(url,this.httpOptionsJSON);
    }
    endDriverTrip(data:string){
      let url=this.API_URL+'/endDriverTrip?'+data;
      return this.httpClient.post(url,this.httpOptionsJSON);
    }
    getDriver():Observable<any> {
      let url=this.API_URL+'/getDriverName?drvdocno='+localStorage.getItem('token');
      return this.httpClient.get<any>(url,this.httpOptionsJSON);
    }
    getBranch(){
      let apiurl=this.API_URL+'/getBranch';
      console.log('API Url:'+apiurl);
      return this.httpClient.get<any>(apiurl,this.httpOptions);
    }
    getLocation(brhid:string){
      let apiurl=this.API_URL+'/getLocation?brhid='+parseInt(brhid);
      console.log(apiurl);
      return this.httpClient.get(apiurl,this.httpOptions);
    }
  getTasks(){
    let driverdocno=localStorage.getItem('token');
    let url=this.API_URL+'/allTasksLimo?driverdocno='+driverdocno;
    return this.httpClient.get(url,this.httpOptions);
  }

  getActiveTask(params:any){
    let driverdocno=localStorage.getItem('token');
    let url=this.API_URL+'/getActiveTask?rdocno='+params.rdocno+'&rdtype='+params.rdtype+'&tripmode='+params.tripmode+'&repno='+params.repno;
    return this.httpClient.get<any>(url,this.httpOptions);
  }

  getFuel(){
    let url=this.API_URL+'/getFuel';
    return this.httpClient.get(url,this.httpOptions);
  }
  saveAgmtDelivery(data:string){
    let url=this.API_URL+'/saveAgmtDelivery?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }
  saveAgmtCollection(data:string){
    let url=this.API_URL+'/saveAgmtCollection?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }
  saveBranchCloseCollection(data:string){
    let url=this.API_URL+'/saveBranchCloseCollection?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }
  saveRepCollection(data:string){
    let url=this.API_URL+'/saveRepCollection?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }
 
  saveRepDelivery(data:string){
    let url=this.API_URL+'/saveRepDelivery?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveRepClosing(data:string){
    let url=this.API_URL+'/saveRepClosing?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }
  
  getMovementFleet(){
    let url=this.API_URL+'/getMovementFleet';
    return this.httpClient.get(url,this.httpOptions);
  }

  getMovFleetMinData(value){
    let url=this.API_URL+'/getMovFleetMinData?fleetno='+value;
    return this.httpClient.get(url,this.httpOptions);
  }

  getStartFleetMinData(value){
    let url=this.API_URL+'/getStartFleetMinData?fleetno='+value;
    return this.httpClient.get(url,this.httpOptions);
  }

  getEndFleetMinData(value){
    let url=this.API_URL+'/getEndFleetMinData?fleetno='+value;
    return this.httpClient.get(url,this.httpOptions);
  }

  getMovType(){
    let url=this.API_URL+'/getMovType';
    return this.httpClient.get(url,this.httpOptions);
  }

  getMovementGarage(){
    let url=this.API_URL+'/getMovementGarage';
    return this.httpClient.get(url,this.httpOptions);
  }

  // insertions to start the trips 
  saveStartTripInsert(data:string):Observable<any>{
    let url=this.API_URL+'/setStartTrip?'+data;
    console.log(url);
    return this.httpClient.post(url,this.httpOptions);
  }
  // insertions to end the trips
  saveEndTripInsert(imagedata: FormData, imagedata2:FormData,data:string){
    let url=this.API_URL+'/setEndTrip?'+data;
    console.log(url);
    let formData = new FormData();
    imagedata.forEach((value, key) => {
      formData.append(key, value);
    });
  
    // Append the second imagedata (assuming it has a key like 'image2')
    imagedata2.forEach((value, key) => {
      formData.append(key, value);
    });

    return this.httpClient.post(url,formData);
  }

  saveMovInsert(data:string):Observable<any>{
    let url=this.API_URL+'/saveMovInsert?'+data;
    console.log(url);
    return this.httpClient.post(url,this.httpOptions);
  }

  getMovExistData(data: string) {
    let url=this.API_URL+'/getMovExistData?rdocno='+data;
    return this.httpClient.get(url,this.httpOptions);
  }

  getStartTripData(data: string,jobstype : string) {
    let url=this.API_URL+'/getStartTripData?rjobtype='+jobstype+'&rdocno='+data+'&driverdocno='+localStorage.getItem('token');
    console.log(url);
    return this.httpClient.get(url,this.httpOptions);
  }

  closeMovTransfer(data:string){
    let url=this.API_URL+'/closeMovTransfer?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveMovDelivery(data: string) {
    let url=this.API_URL+'/saveMovDelivery?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveMovCollection(data: string) {
    let url=this.API_URL+'/saveMovCollection?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveMovGarageBranchClose(data: string):Observable<any> {
    let url=this.API_URL+'/saveMovGarageBranchClose?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  getClient(value:string){
    let url=this.API_URL+'/getClient?value='+value;
    return this.httpClient.get(url,this.httpOptions);
  }

  getClientByJob(value:string){
    let url=this.API_URL+'/getclientbyjob?rdocno='+value;
    return this.httpClient.get(url,this.httpOptions);
  }

  getCardType(){
    let url=this.API_URL+'/getCardType';
    return this.httpClient.get(url,this.httpOptions);
  }

  getStatus(){
    let url=this.API_URL+'/getJobStatus';
    return this.httpClient.get(url,this.httpOptions);
  }

  setStatus(data: string){
    let url=this.API_URL+'/setJobStatus?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveRentalReciept(data: string):Observable<any> {
    let url=this.API_URL+'/saveRentalReciept?'+data;
    return this.httpClient.post(url,this.httpOptions);
  }

  saveInspection(imagedata: FormData,data:string) {
    let url=this.API_URL+'/saveInspection?'+data;
    return this.httpClient.post(url,imagedata);
  }

  saveExpense(imagedata: FormData,data:String){
    let url=this.API_URL+'/saveExpenses?'+data;
    return this.httpClient.post(url,imagedata);
  }

  getInspectDetails(data:string){
    let url=this.API_URL+'/getInspectionDetails?'+data;
    return this.httpClient.get(url,this.httpOptions);
  }

  getInspFleet(){
    let url=this.API_URL+'/getInspFleet';
    return this.httpClient.get(url,this.httpOptions);
  }
  getInspRefDoc(data:string){
    let url=this.API_URL+'/getInspRefDoc?'+data;
    return this.httpClient.get(url,this.httpOptions);
  }
  getRefInspData(fleetno:string){
    let url=this.API_URL+'/getFleetRefData?fleetno='+fleetno;
    return this.httpClient.get(url,this.httpOptions);
  }

  getSavedInspectData(data:string){
    let url=this.API_URL+'/getSavedInspectData?'+data;
    return this.httpClient.get(url,this.httpOptions);
  }

  updateInspection(imagedata: FormData,inspdocno:string,brhid:string) {
    let url=this.API_URL+'/updateInspection?inspdocno='+inspdocno+'&brhid='+brhid;
    return this.httpClient.post(url,imagedata);
  }

  getLastInspData(fleetno:string){
    let url=this.API_URL+'/getLastInspData?fleetno='+fleetno;
    return this.httpClient.get(url,this.httpOptionsJSON);
  }

  saveClient(data:any){
    let url=this.API_URL+'/saveClient';
    return this.httpClient.post(url,data,this.httpOptionsJSON);
  }

  getRentalReadyFleet(brhid:string){
    let url=this.API_URL+'/getRentalReadyFleet?brhid='+brhid;
    return this.httpClient.get(url,this.httpOptions);
  }

  getClientDriver(cldocno:string){
    let url=this.API_URL+'/getClientDriver?cldocno='+cldocno;
    return this.httpClient.get(url,this.httpOptions);
  }

  getTariff(fleetno:string){
    let url=this.API_URL+'/getTariff?fleetno='+fleetno;
    return this.httpClient.get(url,this.httpOptions);
  }
  getTariffDetails(data:string){
    let url=this.API_URL+'/getTariffDetails?'+data;
    return this.httpClient.get<Tarifaddon[]>(url,this.httpOptions);
  }

  getCompanyDriver(){
    let url=this.API_URL+'/getCompanyDriver';
    return this.httpClient.get(url,this.httpOptions);
  }

  getjobs(){
    let url=this.API_URL+'/getjobs?driverdocno='+localStorage.getItem('token');
    return this.httpClient.get(url,this.httpOptions);
  }

  getjobsforassignment(){
    let url=this.API_URL+'/getjobstoassign';
    return this.httpClient.get(url,this.httpOptions);
  }

  checkFleetAvailable(data:any){
    let url=this.API_URL+'/checkFleetAvailable';

    return this.httpClient.post(url,data,this.httpOptionsJSON);
  }

  saveRentalAgreement(data:any){
    let url=this.API_URL+'/saveRentalAgreement';
    return this.httpClient.post(url,data,this.httpOptionsJSON);
  }

  getGlobalData(){
    let url=this.API_URL+'/getGlobalData';
    return this.httpClient.get(url,this.httpOptionsJSON);
  }

  getFleetLastMovData(fleetno){
    let url=this.API_URL+'/getFleetLastMovData?fleetno='+fleetno;
    return this.httpClient.get(url,this.httpOptionsJSON);
  }

  getFileTypes(){
    let url=this.API_URL+'/getFileTypes';
    return this.httpClient.get(url,this.httpOptionsJSON);
  }
}