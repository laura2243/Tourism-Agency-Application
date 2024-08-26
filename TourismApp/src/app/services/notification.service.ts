import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
  clearNotificationsEvent: Subject<number> = new Subject<number>();
  responseRequestEvent: Subject<any> = new Subject<any>();
  sendRequireNotification: Subject<any> = new Subject<any>();

  constructor(private snackBar: MatSnackBar) {
  }

  public showPopupMessage(message: string, confirmText: string | undefined) {
    this.snackBar.open(message, confirmText, {
      panelClass:'snackbar',
      // horizontalPosition:'center',
      // verticalPosition:'top'
      
    });
  }
}
