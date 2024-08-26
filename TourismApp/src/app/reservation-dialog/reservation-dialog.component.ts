import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Destination } from '../data-types/destination.data';
import { DestinationService } from '../services/destination.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptgroup, MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Subject, combineLatest, map } from 'rxjs';
import { Reservation } from '../data-types/reservation.data';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [MatLabel, NgIf, NgFor, MatOption, MatSelectModule, MatFormFieldModule, MatTooltipModule, MatIconModule, MatDatepickerModule, MatCardModule, MatInputModule, MatButtonModule, MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservation-dialog.component.html',
  styleUrl: './reservation-dialog.component.css'
})
export class ReservationDialogComponent {


  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    event.preventDefault();
  }
  refreshEvent: EventEmitter<void> = new EventEmitter<void>();

  title: string = '';
  location: string = '';
  description: string = '';
  start_date: string = '';
  end_date: string = '';
  price: number = 0;
  selected_spots: number = 0;
  makeReservationForm!: FormGroup;
  image_name !: any;
  spots!: number[];
  total_price!: number;

  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();

  startDate: any;
  endDate: any;

  validDate: boolean = false;



  constructor(public dialogRef: MatDialogRef<ReservationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public destinationService: DestinationService, private notif: NotificationService,
    private router: Router, private snackBar: MatSnackBar, private datePipe: DatePipe, public reservationService: ReservationService) { }


  ngOnInit(): void {



    //date picker
    const dateChange$ = combineLatest([this.startDatePicker, this.endDatePicker]).pipe(
      map(([a$, b$]) => ({
        start: a$,
        end: b$
      }))
    );

    dateChange$.subscribe((data) => {
      if (data.start.value && data.end.value) {
        this.startDate = data.start.value
        this.endDate = data.end.value
        this.calculatePrice();
        this.filterDestinationsByDateRange(data.start.value, data.end.value);
      }
    });


    this.initForm(this.data.destination)
  }


  generateSpotsArray(availableSpots: number): number[] {
    return Array.from({ length: availableSpots }, (_, i) => i + 1);
  }
  initForm(destination: Destination) {
    this.makeReservationForm = new FormGroup({

      description: new FormControl(destination.description, Validators.required),
      price: new FormControl({ value: '', disabled: true }, Validators.required),
      selected_spots: new FormControl('', Validators.required),
      start_date: new FormControl({ value: '', disabled: true }, Validators.required),
      end_date: new FormControl({ value: '', disabled: true }, Validators.required),
    });

    this.spots = this.generateSpotsArray(this.data.destination.available_spots);


    // Subscribe to changes in the selected_spot control
    this.makeReservationForm.get('selected_spots')?.valueChanges.subscribe((selectedSpot: number) => {
      this.calculatePrice();
    });





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


    this.coverImgFileName = destination.image_name!
  }


  calculatePrice() {
    var selectedSpot = this.makeReservationForm.get('selected_spots')?.value

    if (this.startDate !== undefined) {
      console.log(this.startDate)
    }
    if (selectedSpot && this.endDate !== undefined && this.startDate !== undefined && selectedSpot !== null && !isNaN(selectedSpot) && this.endDate && this.startDate) {


      if (this.data.destination?.discount != 0) {

        var priceWithDiscount = this.data.destination?.price - (this.data.destination?.price * this.data.destination?.discount / 100)
        const nr_of_days = (this.endDate - this.startDate) / (1000 * 3600 * 24);
        var priceWithNights = priceWithDiscount * nr_of_days


        this.total_price = (priceWithNights || 0) * selectedSpot;
      } else {

        const nr_of_days = (this.endDate - this.startDate) / (1000 * 3600 * 24);


        var priceWithNights = this.data.destination?.price * nr_of_days
        this.total_price = (priceWithNights || 0) * selectedSpot;

      }
      this.makeReservationForm.patchValue({ price: this.total_price });
      console.log("dada")


    }
  }



  dateTimeComparisonValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDateTime = control.get('start_date')?.value;
      const endDateTime = control.get('end_date')?.value;

      if (startDateTime && endDateTime && startDateTime > endDateTime) {
        return { dateTimeComparison: true };
      }

      return null;
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }




  showImg!: any;
  coverImgFile!: File;
  coverImgFileName!: string;
  imageSelected: boolean = false;

  onFileSelected(event: any) {


    this.coverImgFile = event.target.files[0];
    this.coverImgFileName = this.coverImgFile.name;
    this.imageSelected = true;
    this.showImg = URL.createObjectURL(event.target.files[0]);
  }

  private formatDate(date: Date = new Date(), format: string = 'MM/DD/YYYY'): string {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    let formattedDate: string;

    switch (format) {
      case 'MM/DD/YYYY':
        formattedDate = `${month}/${day}/${year}`;
        break;
      case 'YYYY-MM-DD':
        formattedDate = `${year}-${month}-${day}`;
        break;
      // Add more cases for additional formats if needed
      default:
        formattedDate = `${month}/${day}/${year}`;
        break;
    }

    return formattedDate;
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



  // filter destinations based on the selected date range
  filterDestinationsByDateRange(startDate: any, endDate: any) {


    if (startDate && endDate) {
      // Set time to midnight for both start and end dates
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Create date objects for destination start and end dates
      const destinationStartDate = new Date(this.data.destination.start_date);
      const destinationEndDate = new Date(this.data.destination.end_date);

      // Set time to midnight for destination start and end dates
      destinationStartDate.setHours(0, 0, 0, 0);
      destinationEndDate.setHours(0, 0, 0, 0);

      this.validDate = !(destinationStartDate.getTime() <= startDate.getTime() &&
        destinationEndDate.getTime() >= endDate.getTime());


    }

  }


  // Function to check if a value is null, undefined, or an empty string
  isNullOrUndefinedOrEmptyString(value: any): boolean {
    return value === null || value === undefined || value === '';
  }


  formInvalid: boolean = false;
  onSubmit() {





    var currentUser = sessionStorage.getItem('currentUser');
    var currentUserId;
    if (currentUser) {


      var currentUserObject = JSON.parse(currentUser);
      currentUserId = currentUserObject.user.id;
    }

    const reservation: any = {

      destination_id: this.data.destination.id,
      user_id: currentUserId,
      reservation_date: this.formatDate(),
      start_date: this.formatDate(this.startDate),
      end_date: this.formatDate(this.endDate),
      total_price: this.total_price,
      nr_spots: this.makeReservationForm.get('selected_spots')?.value
    }



    // Check each property of the reservation object
    const nullUndefinedOrEmptyFields: string[] = [];
    for (const key in reservation) {
      if (Object.prototype.hasOwnProperty.call(reservation, key)) {
        if (this.isNullOrUndefinedOrEmptyString(reservation[key])) {
          nullUndefinedOrEmptyFields.push(key);
        }
      }
    }

    if (nullUndefinedOrEmptyFields.length > 0) {

      this.validDate = true
    } else {




      this.reservationService.addReservation(reservation).subscribe({
        next: () => {
          this.snackBar.open('Reservation successfully added', 'Close', {
            duration: 5000,
          });


          this.destinationService.consumeSpots(this.data.destination.id, this.makeReservationForm.get('selected_spots')?.value).subscribe({
            next: () => {

            }, error: () => {

              this.notif.showPopupMessage("Couldn't add reservation!", "OK")
              this.dialogRef.close();
              console.debug;
            }
          }
          );

          this.dialogRef.close();
          this.refreshEvent.emit();



        }, error: () => {

          this.notif.showPopupMessage("Couldn't add reservation!", "OK")
          this.dialogRef.close();
          console.debug;
        }

      }

      );

    }

  }

}
