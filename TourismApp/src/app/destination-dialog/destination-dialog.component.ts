import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Destination } from '../data-types/destination.data';
import { DestinationService } from '../services/destination.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';
import { DatePipe } from '@angular/common';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-destination-dialog',
  templateUrl: './destination-dialog.component.html',
  styleUrls: ['./destination-dialog.component.css']
})
export class DestinationDialogComponent implements OnInit {


  refreshEvent: EventEmitter<void> = new EventEmitter<void>();

  title: string = '';
  location: string = '';
  description: string = '';
  start_date: string = '';
  end_date: string = '';
  price: number = 0;
  discount: number = 0;
  available_spots: number = 0;
  addDestinationForm!: FormGroup;
  toUpdateDestination !: Destination;
  image_name !: any;
  buttonText !: string;
  titleText !: string;

  constructor(public dialogRef: MatDialogRef<DestinationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public destinationService: DestinationService, private notif: NotificationService,
    private router: Router, private snackBar: MatSnackBar, private datePipe: DatePipe) { }


  ngOnInit(): void {

    if (this.data.action === 'add') {
      this.initForm();
      this.buttonText = 'Add';
      this.titleText = 'Add a new';

    }
    else if (this.data.action === 'update') {

      this.initUpdateForm(this.data.destination);
      this.buttonText = 'Update';
      this.titleText = 'Update an existing';
    }

  }




  initForm() {
    this.addDestinationForm = new FormGroup({
      image_name: new FormControl(''),
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      available_spots: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    });
  }


  initUpdateForm(destination: Destination) {



    this.addDestinationForm = new FormGroup({
      image_name: new FormControl(destination.image_name),
      title: new FormControl(destination.title, Validators.required),
      location: new FormControl(destination.location, Validators.required),
      description: new FormControl(destination.description, Validators.required),
      price: new FormControl(destination.price, [Validators.required, Validators.min(0)]),
      discount: new FormControl(destination.discount, [Validators.required, Validators.min(0)]),
      available_spots: new FormControl(destination.available_spots, [Validators.required, Validators.min(0)]),
      start_date: new FormControl(this.convertToDate(destination.start_date), Validators.required),
      end_date: new FormControl(this.convertToDate(destination.end_date), Validators.required),
    }, { validators: this.dateTimeComparisonValidator() });




    const byteCharacters = atob(destination.image_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' }); // Adjust the MIME type according to your image type


    this.coverImgFile = new File([blob], destination.image_name!, { type: 'image/png' })

    this.imageSelected = true;
    this.showImg = URL.createObjectURL(this.coverImgFile);

    console.log(destination)
    this.coverImgFileName = destination.image_name!
  }

  dateTimeComparisonValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDateTime = control.get('start_date')?.value;
      const endDateTime = control.get('end_date')?.value;

      if (startDateTime && endDateTime && startDateTime > endDateTime ) {
        return { dateTimeComparison: true };
      }

      return null;
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  nonNegativeValidator(control: AbstractControl) {
    const value = control.value;
    if (value < 0) {
      return { 'negative': true };
    }
    return null;
  }


  showImg !: any;
  coverImgFile!: File;
  coverImgFileName!: string;
  imageSelected: boolean = false;

  onFileSelected(event: any) {


    this.coverImgFile = event.target.files[0];
    this.coverImgFileName = this.coverImgFile.name;
    this.imageSelected = true;
    this.showImg = URL.createObjectURL(event.target.files[0]);
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  convertToDate(dateString: string | undefined): Date | undefined {
    if (dateString) {
      const parts = dateString.split('/');
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);


      const date = new Date(year, month - 1, day);
      return date;
    }
    return undefined;


  }
  onSubmit() {


    const destination: Destination = {

      title: this.addDestinationForm.get('title')?.value,
      location: this.addDestinationForm.get('location')?.value,
      description: this.addDestinationForm.get('description')?.value,
      price: this.addDestinationForm.get('price')?.value,
      discount: this.addDestinationForm.get('discount')?.value,
      available_spots: this.addDestinationForm.get('available_spots')?.value,
      start_date: this.formatDate(this.addDestinationForm.get('start_date')?.value),
      end_date: this.formatDate(this.addDestinationForm.get('end_date')?.value)
    };




    if (this.data.action === 'add') {


      this.destinationService.addDestination(destination, this.coverImgFile).subscribe({
        next: () => {
          this.snackBar.open('Destination successfully added', 'Close', {
            duration: 5000,
          });

          this.dialogRef.close();
          this.refreshEvent.emit();



        }, error: () => {

          this.notif.showPopupMessage("Couldn't add destination!", "OK")
          this.dialogRef.close();
          console.debug;
        }

      }

      );
    } else if (this.data.action === 'update') {

      destination.id = this.data.destination.id;
      console.log(destination)
      this.destinationService.updateDestination(destination, this.coverImgFile).subscribe({

        next: () => {


          this.snackBar.open('Destination successfully updated', 'Close', {
            duration: 5000,
          });
          this.dialogRef.close();


        }, error: () => {

          this.notif.showPopupMessage("Couldn't update destination!", "OK")
          console.debug;
          this.dialogRef.close();
        }
      }

      );


    }
  }

}
