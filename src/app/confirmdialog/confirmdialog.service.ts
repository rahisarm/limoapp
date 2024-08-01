import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmdialogComponent } from './confirmdialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmdialogService {

  constructor(public dialog:MatDialog) { }

  public open(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '400px',
      data: { title, message }
    });

    return dialogRef.afterClosed();
  }
}
