import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config:any;
  constructor(private http:HttpClient) { }

  loadConfig():Observable<any> {
    console.log('inside config.json');
    return this.http.get('/assets/config.json');
  }
}
