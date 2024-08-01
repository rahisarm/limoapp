import { HttpRequest, HttpEvent, HttpHandler,HttpInterceptor, HttpErrorResponse } from "@angular/common/http";import { Injectable } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { environment } from '../environments/environment';
import { Observable,catchError,map, throwError } from 'rxjs';
import { Router} from '@angular/router';


@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService,private router:Router){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authService;
        const isLoggedIn = user.isLoggedIn;
        const isApiUrl = request.url.startsWith(environment.baseUrl);
        if (isLoggedIn && isApiUrl) {
            console.log("Entered Interceptor");
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                // Redirect to the login page
                this.router.navigate(['/login']);
              }
              return throwError(error);
            })
          );;
    }
}