import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role, User } from '../data-types/user.data';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtServiceService } from '../services/jwt-service.service';
import { NotificationService } from '../services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  name !: String;
  email !: String;
  password !: String;
  passwordRepeate !: String;
  passwordsMatch: boolean = true;
  hiddenPwd: boolean = true;
  hiddenRepeatPwd: boolean = true;
  usernameExists: boolean = false;


  constructor(private loginService: LoginService, private router: Router,
    private cookieService: CookieService, private jwtService: JwtServiceService,
    private notif: NotificationService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordRepeat: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.registerForm.value.password != this.registerForm.value.passwordRepeat) {
      this.passwordsMatch = false;


    } else {
      const user: User = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: Role.CLIENT

      }

      console.log(user);



      this.loginService.register<User>(user).subscribe({
        next: (entity: User) => {


          if (entity == null) {

            this.notif.showPopupMessage("Username already exists!", "OK")
          } else {

            this.snackBar.open('User registered successfully!', 'Close', {
              duration: 7000,
            });
            this.router.navigate(['/login']);
          }




        }, error: () => {

          this.notif.showPopupMessage("Email already exists!", "OK")
          console.debug;
        }
      }

      );

    }
  }
}

