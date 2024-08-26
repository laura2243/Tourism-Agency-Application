import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { User } from '../data-types/user.data';
import { CookieService } from 'ngx-cookie-service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  email !: String;
  password !: String;
  userFound: boolean = true;
  hiddenPwd: boolean = true;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {


    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  getUserRole(): string {
    const currentUserString = sessionStorage.getItem('currentUser');
    if (!currentUserString) {
      return 'null';
    }
    const currentUser = JSON.parse(currentUserString)
    if (currentUser && currentUser.user && currentUser.user.hasOwnProperty('role')) {
      return currentUser.user.role;
    } else {
      return 'null';
    }
  }


  locateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const userLocation = { latitude, longitude };

        sessionStorage.setItem('userLocation', JSON.stringify(userLocation));


        console.log('User location saved:', userLocation);
      }, (error) => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  onSubmit() {

    console.log("da")

    this.email = this.loginForm.get('email')?.value
    this.password = this.loginForm.get('password')?.value




    this.loginService.login<User>(this.loginForm.value).subscribe({
      next: () => {


        let userRole !: string;
        userRole = this.getUserRole()

        if (userRole == null) {

          this.userFound = false;
        } else {


         

          if (userRole == "admin") {
            this.router.navigate(['/'] )
          } else if (userRole == "client") {
            this.locateUser();
            this.router.navigate(['/'])
          } else {
            console.log("User has no specific role!")
          }
        }

      },
      error: (error) => {
        this.userFound = false;
      }
    }
    );

  }

  backClicked() {
    this._location.back();
  }

}

