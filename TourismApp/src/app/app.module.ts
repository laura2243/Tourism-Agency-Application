import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DestinationDialogComponent } from './destination-dialog/destination-dialog.component';
import {MatSelectModule} from '@angular/material/select';
// import { JwtServiceService } from './services/jwt-service.service';
// import { HttpInterceptorService } from './services/http-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotificationService } from './services/notification.service';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { CustomDateFormatPipe } from './services/date-format.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClientGuardService } from './services/client-dashboard-guard.service';
import { LoginGuardService } from './services/login-guard.service';
import { HttpInterceptorService } from './services/http-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DestinationDialogComponent,
    DialogBoxComponent,
    CustomDateFormatPipe,
    

  ],
  imports: [
    MatTooltipModule,
    MatIconModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    TitleCasePipe,
    CommonModule,
    NgApexchartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    provideNativeDateAdapter(),provideAnimations(), NotificationService,DatePipe,TitleCasePipe,ClientGuardService,LoginGuardService
    // ,JwtServiceService
  ],
  exports: [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
