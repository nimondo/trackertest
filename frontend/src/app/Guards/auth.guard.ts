import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import {
  Observable,
  of,
} from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthentication(state.url, route.data['role']);
  }

  private checkAuthentication(returnUrl: string, roles: string[]): Observable<boolean> {
    const jwtToken = this.authService.getToken();
    if (!jwtToken || this.jwtHelper.isTokenExpired(jwtToken)) {
      return this.handleInvalidToken(jwtToken, returnUrl);
    } else {
      return this.checkUserRole(roles, returnUrl);
    }
  }

  private handleInvalidToken(jwtToken: string | null, returnUrl: string): Observable<boolean> {
    if (jwtToken && this.jwtHelper.isTokenExpired(jwtToken)) {
      this.snackBar.open('Your session has expired. Please log in again.', '❌');
      this.authService.signOut();
    } else {
      this.snackBar.open('Access Denied!', '❌');
    }
    this.router.navigate(['/signin'], { queryParams: { returnUrl } });
    return of(false);
  }

  private checkUserRole(roles: string[], returnUrl: string): Observable<boolean> {
    const userRole = this.authService.getRole();
    if (roles && roles.indexOf(userRole) === -1) {
      this.snackBar.open('Access Denied! Role Not Granted.', '❌');
      this.router.navigate(['/home'], { queryParams: { returnUrl } });
      return of(false);
    }
    return of(true);
  }
}
