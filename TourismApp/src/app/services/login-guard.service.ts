import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  canActivate(): boolean {


    var role;
    const currentUserString = sessionStorage.getItem('currentUser');
    console.log(this.activatedRoute.queryParams.subscribe(param => {
      console.log(param)
      role = param['role']
    }));

    if (currentUserString == undefined || currentUserString == null) {

      // Get the query parameter from the current route
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['role']) {
          // Remove the query parameter and navigate to the same route without it
          const queryParamsWithoutParam = { ...params };
          delete queryParamsWithoutParam['role'];

          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParamsWithoutParam,
            queryParamsHandling: 'merge' // Merge the new query parameters with existing ones
          });
        }
      });


      return true;

    } else {
      const currentUser = JSON.parse(currentUserString)
      if (currentUser && currentUser.user && currentUser.user.hasOwnProperty('role')) {


        const currentUserRole = currentUser.user.role;
        if (currentUserRole == "ADMIN") {
          this.router.navigate(['/'], { queryParams: { role: currentUserRole } });
          return true;
        }
        else if (currentUserRole == "CLIENT") {
          this.router.navigate(['/'], { queryParams: { role: currentUserRole } });
          return true;
        }
        // this.router.navigate(['/'])
        return true;
      } else {
        // this.router.navigate(['/'])
        return true;
      }

      return true;

    }


  }
}
