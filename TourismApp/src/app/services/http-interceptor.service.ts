import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("?role=admin")) {
      const currentUserString = sessionStorage.getItem('currentUser');
      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        const currentUserRole = currentUser.user.role;
        if (currentUserRole !== 'ADMIN') {
          // Redirect to "/" if the role is not admin
          this.router.navigate(['/']);
          // Return an observable that completes immediately
          return new Observable<HttpEvent<any>>();
        }
      } else {
        console.log(currentUserString)
        // Redirect to "/" if currentUser is not found in sessionStorage
        this.router.navigate(['/']);
        // Return an observable that completes immediately
        return new Observable<HttpEvent<any>>();
      }
    }
    // Continue with the request for other URLs
    return next.handle(req);
  }
}
