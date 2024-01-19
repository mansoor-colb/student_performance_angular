
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router) {}
  isAdmin(): boolean {
    if(!(localStorage.getItem("uid"))){
      return false
    }
    const userRole:any = localStorage.getItem('uid');
    return userRole.substring(userRole.indexOf('-') + 1) === 'Admin';
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAdmin()) {
      return true; // Allow access to the route
    } else {
        
      this.router.navigateByUrl('unauthorized'); // Redirect to unauthorized page
      return false; // Deny access
    }
  }
}


