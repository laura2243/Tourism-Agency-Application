
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogData } from '../data-types/dialog-data.data';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {


  constructor(

    private router: Router,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData

  ) { }

  onOkClick(content: string): void {
    this.dialogRef.close();

    if (content === "Password changed successfuly!") {
      this.cookieService.delete("auth-cookie");
      this.router.navigate([''])
    }

  }

  logout() {

    this.cookieService.delete("auth-cookie");
    this.router.navigate([''])
  }
  deleteUser(answer: string) {

    this.dialogRef.close(answer);


  }
}
