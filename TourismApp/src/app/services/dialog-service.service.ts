import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';




@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {
  }
  openDialog(modalText: string, onLogout: boolean, onDeleteUser: boolean, onPasswordChange: boolean, onDeleteEvent: boolean): any {
    let dialogRef = this.dialog.open(DialogBoxComponent, {
      data: { content: modalText, onLogout: onLogout, onDeleteUser: onDeleteUser, onPasswordChange: onPasswordChange, onDeleteEvent: onDeleteEvent },
    });
  }
}
