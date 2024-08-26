import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, combineLatest, filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DestinationDialogComponent } from '../destination-dialog/destination-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Destination } from '../data-types/destination.data';
import { DestinationService } from '../services/destination.service';
import { DialogService } from '../services/dialog-service.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { User } from '../data-types/user.data';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  title = 'TourismApp';
  contactForm!: FormGroup;
  email!: any;
  content!: any;
  userRole!: any;
  destinations: Destination[] = [];
  offerDestinations: Destination[] = [];
  loginForm: any;
  loggedUser: boolean = false;
  currentUserName!: string;
  filteredDestinationsDate: any[] = [];
  buttonText!: string;
  @ViewChild('cardContainer', { static: true }) cardContainer!: ElementRef;

  refreshContent() {

    const container = this.cardContainer.nativeElement as HTMLElement;
    container.innerHTML = 'New content';
  }


  @ViewChild('scrollToOffersTarget') scrollToOffersTarget!: ElementRef<HTMLElement>;
  @ViewChild('scrollToAllDestinationsTarget') scrollToAllDestinationsTarget!: ElementRef<HTMLElement>;
  @ViewChild('scrollToContactTarget') scrollToContactTarget!: ElementRef<HTMLElement>;
  @ViewChild('scrollToHomeTarget') scrollToHomeTarget!: ElementRef<HTMLElement>;
  @ViewChild('scrollToAboutUsTarget') scrollToAboutUsTarget!: ElementRef<HTMLElement>;


  startDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  endDatePicker = new Subject<MatDatepickerInputEvent<any>>();
  currentUserRole: any;


  constructor(private viewportScroller: ViewportScroller, public dialog: MatDialog, private route: ActivatedRoute,
    private destinationService: DestinationService, private dialogService: DialogService, private router: Router) {
  }

  openDialogUpdate(action: string, destination?: Destination): void {
    const dialogRef = this.dialog.open(DestinationDialogComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'transparent-dialog',
      data: {
        action: action,
        destination: destination
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.destinationService.getDestinations().subscribe(
        {
          next: (data: Destination[]) => {

            this.destinations = [...data]
            this.offerDestinations = this.destinations.filter(destination => destination.discount! > 0);

            console.log(this.destinations)
          }
        });

    });
  }

  openDialogAdd(action: string, destination?: Destination): void {
    const dialogRef = this.dialog.open(DestinationDialogComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'transparent-dialog',
      data: {
        action: action,
        destination: destination
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      this.destinationService.getDestinations().subscribe(
        {
          next: (data: Destination[]) => {

            this.destinations = [...data]
            this.offerDestinations = this.destinations.filter(destination => destination.discount! > 0);

            console.log(this.destinations)
          }
        }
      );

    });
  }

  openReservationDialog(destination?: Destination): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'transparent-dialog',
      data: {

        destination: destination
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // var container = document.getElementById("card-container");
      // var content = container?.innerHTML;
      // container?.innerHTML != content;
      this.destinationService.getDestinations().subscribe(
        {
          next: (data: Destination[]) => {

            console.log("daaa")
            this.destinations = [...data]
            this.offerDestinations = this.destinations.filter(destination => destination.discount! > 0);

            console.log(this.destinations)

          }
        }
      )
    });

    var container = document.getElementById("card-container");
    var content = container?.innerHTML;
    container?.innerHTML != content;


    var container = document.getElementById("card-container-offers");
    var content = container?.innerHTML;
    container?.innerHTML != content;
  }



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
        this.filterDestinationsByDateRange(data.start.value, data.end.value);
      }
    });

    console.log(this.currentUserName)
    var currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {

      this.loggedUser = true;
      var currentUserObject = JSON.parse(currentUser);
      this.currentUserName = currentUserObject.user.name.toUpperCase();
      this.currentUserRole = currentUserObject.user.role.toUpperCase();
      if (this.currentUserRole == "CLIENT") {
        this.buttonText = "Book Now";
      } else {
        this.buttonText = "View Stats";
      }
    }




    this.destinationService.getDestinations().subscribe(
      {
        next: (data: Destination[]) => {

          this.destinations = [...data]
          this.offerDestinations = this.destinations.filter(destination => destination.discount! > 0);


        }
      }
    )


    this.initContactForm()
  }


  isUserAdmin(): boolean {
    const currentUserString = sessionStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString)

      const currentUserRole = currentUser.user.role;
      this.userRole = currentUserRole
    }
    return this.userRole === 'admin';
  }


  initContactForm() {
    this.contactForm = new FormGroup({
      email: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });
  }

  scrollToHome() {
    this.scrollToHomeTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToAboutUs() {
    this.scrollToAboutUsTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToOffers() {
    this.scrollToOffersTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToAllDestinations() {
    this.searchedDestination = false;
    this.scrollToAllDestinationsTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToAllDestinationsFromSearch() {
    this.scrollToAllDestinationsTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToContact() {
    this.scrollToContactTarget.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  filteredDestinations: any[] = [];
  searchQuery: string = '';
  searchedDestination: boolean = false;
  showTextNoDestinationFound: boolean = false;
  showTextNoDateFound: boolean = false;

  filterDestinations() {
    if (!this.searchQuery) {
      this.filteredDestinations = this.destinations;
    } else {
      this.filteredDestinations = this.destinations.filter(destination => {
        return destination.location?.toLowerCase() === this.searchQuery.toLowerCase();
      });
    }

    if (this.filteredDestinations.length == 0) {
      this.showTextNoDestinationFound = true;
    } else {
      this.showTextNoDestinationFound = false;
    }
    this.searchedDestination = true;
    this.scrollToAllDestinationsFromSearch()
  }




  open(destination: Destination) {
    let dialogRef = this.openDialogDeleteUser("Are you sure you want to delete this destination?", false, true, false, destination)
  }

  openDialogDeleteUser(modalText: string, onLogout: boolean, onDeleteUser: boolean, onPasswordChange: boolean, destination: Destination): any {
    let dialogRef = this.dialog.open(DialogBoxComponent, {
      data: { content: modalText, onLogout: onLogout, onDeleteUser: onDeleteUser, onPasswordChange: onPasswordChange, destination: destination },
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.deleteDestination(destination)

      }
    }

    )

  }

  deleteDestination(destination: Destination) {
    this.destinationService.deleteDestination(destination.id).subscribe({
      next: () => {

        this.dialogService.openDialog("Destination deleted successfully!", false, false, true, false);
        this.destinationService.getDestinations().subscribe(
          {
            next: (data: Destination[]) => {
              this.destinations = [...data]
              console.log(this.destinations)
            }
          }
        )


      }, error: () => {

        this.dialogService.openDialog("Couldn't delete Destination!", false, false, true, false);
        console.debug;
      }
    }
    );
  }


  logOut() {
    localStorage.removeItem('accessToken');
    sessionStorage.clear();
    localStorage.clear();


    this.router.navigate(['/login']);
  }


  // filter destinations based on the selected date range
  filterDestinationsByDateRange(startDate: any, endDate: any) {

    if (startDate && endDate) {
      // Set time to midnight for both start and end dates
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      this.filteredDestinations = this.destinations.filter(destination => {
        if (destination.start_date && destination.end_date) {
          // Create date objects for destination start and end dates
          const destinationStartDate = new Date(destination.start_date);
          const destinationEndDate = new Date(destination.end_date);

          // Set time to midnight for destination start and end dates
          destinationStartDate.setHours(0, 0, 0, 0);
          destinationEndDate.setHours(0, 0, 0, 0);

          // Compare dates without considering time zones
          return destinationStartDate.getTime() <= startDate.getTime() &&
            destinationEndDate.getTime() >= endDate.getTime();
        }
        return false;
      });


    }
    this.searchedDestination = true;
    if (this.filteredDestinations.length == 0) {
      this.showTextNoDateFound = true;
    } else {
      this.showTextNoDateFound = false;
    }
  }


  goToStatsPage(destination: any) {
    console.log(destination)
    const destinationParam: Destination = {
      id: destination.id,
      title: destination.title,
      location: destination.location,
      price: destination.price,
      available_spots: destination.available_spots,
      description: destination.description,
      discount: destination.discount,
      image_data: destination.image_data,
      image_name: destination.image_name,
      start_date: destination.start_date,
      end_date: destination.end_date
    };



    this.router.navigate(['/view-reservations'], {
      queryParams: {
        destinationId: destination.id, destinationName: destination.name,
        destinationStartDateString: destination.start_date, destinationEndDateString: destination.end_date
      }
    });

  }



}
