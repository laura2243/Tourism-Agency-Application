import { Component, OnInit, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../data-types/user.data';
import { CookieService } from 'ngx-cookie-service';
import { Reservation } from '../data-types/reservation.data';
import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {Location} from '@angular/common';
import { MatDateRangeInput, MatDateRangePicker, MatDatepicker, MatDatepickerToggle } from '@angular/material/datepicker';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule,
  ApexFill
} from "ng-apexcharts";
import { Destination } from '../data-types/destination.data';

export type ChartOptions = {
  colors: any,
  fill: ApexFill,
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-view-reservations',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    TitleCasePipe,
    NgIf,
    MatFormField,
    MatLabel,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    NgApexchartsModule,
  
  ],
  templateUrl: './view-reservations.component.html',
  styleUrl: './view-reservations.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ViewReservationsComponent implements OnInit {

  loginForm!: FormGroup;
  email !: String;
  password !: String;
  userFound: boolean = true;
  reservations: Reservation[] = [];
  destinationId!: string;
  destinationName!: string;
  destinationStartDateString!: string;
  destinationEndDateString!: string;
  reservationsByMonth: { [month: string]: number[] } = {
    'January': [],
    'February': [],
    'March': [],
    'April': [],
    'May': [],
    'June': [],
    'July': [],
    'August': [],
    'September': [],
    'October': [],
    'November': [],
    'December': []
  };
  frequencyVector: { [month: string]: number } = {};
  monthKeys: string[] = [];
  reservationCounts: number[] = [];

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService,
    public titlecase: TitleCasePipe, public reservationService: ReservationService, private route: ActivatedRoute,private _location: Location) {




  }
  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.destinationId = params['destinationId'];
      this.destinationName = params['destinationName'];

    });



    // this.getReservations();

    this.reservationService.getReservationsByDestinationId(this.destinationId).subscribe(
      {
        next: (data: Reservation[]) => {

          this.reservations = [...data]
          this.populateReservationsByMonth();
          this.getNumberOfReservationsByMonth();



          this.renderCalendarComponent();
          this.renderStatisticsComponent();


        }
      });


  }


  getNumberOfReservationsByMonth() {
    for (const reservation of this.reservations) {
      const startDateString: string | undefined = reservation.start_date;
      const endDateString: string | undefined = reservation.end_date;

      if (!startDateString || !endDateString) {
        continue;
      }

      const startDate: Date = new Date(startDateString);
      const endDate: Date = new Date(endDateString);

      let currentDate: Date = new Date(startDate); // Initialize currentDate with startDate
      let destinationStartDate = new Date(this.destinationStartDateString)
      let destinationEndDate = new Date(this.destinationEndDateString)


      // Keep track of reservations that have been counted for each month
      const countedReservations: Set<string> = new Set();

      while (currentDate <= endDate) {

        const monthYearKey = `${currentDate.getMonth() + 1}`;

        if (!countedReservations.has(monthYearKey)) {

          // Increment count for the month in the frequency vector
          if (this.frequencyVector[monthYearKey]) {
            this.frequencyVector[monthYearKey]++;
          } else {
            this.frequencyVector[monthYearKey] = 1;
          }
          // Mark this reservation as counted for this month
          countedReservations.add(monthYearKey);
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }






    //get the last month introduced in the vector
    const monthKeysNumbers: string[] = Object.keys(this.frequencyVector);
    monthKeysNumbers.sort();
    const lastMonthKey: string | undefined = monthKeysNumbers[monthKeysNumbers.length - 1];
    const lastMonth: number | undefined = lastMonthKey ? +lastMonthKey : undefined;


    // Fill the frequency vector with zeros for the months from lastMonth to December
    if (lastMonth !== undefined) {

      for (let month = lastMonth + 1; month <= 12; month++) {
        const monthKey = `${month}`;
        this.frequencyVector[monthKey] = 0;
      }
    }

    console.log(this.frequencyVector);

    //add  missing months



    // Get the keys (months) from the frequencyVector
    const monthKeys = Object.keys(this.frequencyVector).map(Number);
    // Sort the keys in ascending order
    monthKeys.sort((a, b) => a - b);

    // Iterate over the keys and add missing months with value 0
    for (let i = 0; i < monthKeys.length - 1; i++) {
      const currentMonth = monthKeys[i];
      const nextMonth = monthKeys[i + 1];
      if (nextMonth - currentMonth > 1) {
        // Add missing months between currentMonth and nextMonth
        for (let j = currentMonth + 1; j < nextMonth; j++) {
          this.frequencyVector[j.toString()] = 0;
        }
      }
    }

    // Sort the keys again after adding missing months
    monthKeys.sort((a, b) => a - b);

    // Ensure the frequencyVector has consecutive months starting from the smallest key
    for (let i = monthKeys[0]; i <= monthKeys[monthKeys.length - 1]; i++) {
      if (!this.frequencyVector.hasOwnProperty(i.toString())) {
        // Add missing months with value 0
        this.frequencyVector[i.toString()] = 0;
      }
    }
    //


    this.monthKeys = Object.keys(this.frequencyVector).map(key => {
      const month = +key;
      const monthName = new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });
      return `${monthName}`;
    });

    this.reservationCounts = Object.values(this.frequencyVector);






  }

  private populateReservationsByMonth() {


    for (const reservation of this.reservations) {
      const startDateString: string | undefined = reservation.start_date;
      const endDateString: string | undefined = reservation.end_date;


      if (!startDateString || !endDateString) {
        continue;
      }

      const startDate: Date = new Date(startDateString);
      const endDate: Date = new Date(endDateString);

      let currentDate: Date = new Date(startDate); // Initialize currentDate with startDate

      while (currentDate <= endDate) {

        const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

        if (!this.reservationsByMonth[monthName]) {
          this.reservationsByMonth[monthName] = [];
        }
        this.reservationsByMonth[monthName].push(currentDate.getDate());

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);

      }
    }
  }




  renderStatisticsComponent() {
    this.chartOptions = {


      fill: {
        type: "gradient",
        colors: ["rgb(23, 82, 46)"],
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["rgb(23, 82, 46)"],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.4,

        }
      },
      colors: [" rgb(23, 82, 46)"],

      series: [
        {
          name: "Reservations",
          data: this.reservationCounts,


        }
      ],

      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: this.monthKeys
      },


      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      },

    };
    this.chartOptions.fill = this.chartOptions.fill as ApexFill;
  }

  public generateData(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  renderCalendarComponent() {

    const daysTag = document.querySelector(".days"),
      currentDate = document.querySelector(".current-date"),
      prevNextIcon = document.querySelectorAll(".icons span");

    let date = new Date(),
      currYear = date.getFullYear(),
      currMonth = date.getMonth();
    // storing full name of all months in array
    const months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    const renderCalendar = () => {
      let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
      let liTag = "";



      for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }

      for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month

        if (this.reservationsByMonth[months[currMonth]].includes(i)) {
          liTag += `<li _ngcontent-ng-c3958097677 class="active">${i}</li>`
        } else {
          liTag += `<li _ngcontent-ng-c3958097677 >${i}</li>`

        }

      }


      for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days

        liTag += `<li _ngcontent-ng-c3958097677 class="inactive">${i - lastDayofMonth + 1}</li>`

      }
      (currentDate as HTMLElement).innerText = `${months[currMonth]} ${currYear}`;

      daysTag!.innerHTML = liTag;

    }
    renderCalendar();
    prevNextIcon.forEach(icon => { // getting prev and next icons
      icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
          // creating a new date of current year & month and pass it as date value
          date = new Date(currYear, currMonth, new Date().getDate());
          currYear = date.getFullYear(); // updating current year with new date year
          currMonth = date.getMonth(); // updating current month with new date month
        } else {
          date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
      });
    });

  }

  backClicked() {
    this._location.back();
  }




}

