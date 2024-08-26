import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ViewReservationsComponent } from './view-reservations/view-reservations.component';
import { ClientGuardService } from './services/client-dashboard-guard.service';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'view-reservations', component: ViewReservationsComponent,canActivate:[ClientGuardService]},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '',pathMatch:'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


  

}
