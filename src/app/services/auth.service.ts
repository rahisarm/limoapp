import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Observable,map } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private http:HttpClient,
    private router:Router
  ) { }

  loginUser(data:any):Observable<any>{
    let body ={"username": data.username ,"password": data.password}

    let httpOptions = {
      headers : new HttpHeaders({'Content-Type': 'application/json'})
    };
    let url=environment.baseUrl.replace('/api','')+`/auth/login`;
    console.log("url  -  "+url);
    return this.http.post(url,body,httpOptions);
  }

  login(driverdocno: string,userdocno:string,accessToken: string) {
    localStorage.setItem('token',driverdocno);
    localStorage.setItem('access_token',accessToken);
    localStorage.setItem('userid',userdocno);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userid');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}


