import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackbar:MatSnackBar) { }

  error(message:string){
    return this._snackbar.open(message,undefined,{panelClass:['snackbar-error']})
  }
  success(message:string){
    return this._snackbar.open(message,undefined,{panelClass:['snackbar-success']})
  }
  info(message:string){
    return this._snackbar.open(message,undefined,{panelClass:['snackbar-success']})
  }
  
}
