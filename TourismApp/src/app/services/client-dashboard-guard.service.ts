import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtServiceService } from './jwt-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuardService implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router, private jwtService: JwtServiceService) { }

  canActivate(): boolean {
    const currentUserString = sessionStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString)

      const currentUserRole = currentUser.user.role;

      if (currentUserRole == 'client') {
        this.router.navigate(['/']);
        return false;}
     
      
      return true;
    }
    this.router.navigate(['/']);
    return false;


  }
}
