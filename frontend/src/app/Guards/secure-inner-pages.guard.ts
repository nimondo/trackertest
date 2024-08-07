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
export class SecureInnerPagesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkLogin(state.url);
  }

  private checkLogin(returnUrl: string): Observable<boolean> {
    const token = this.authService.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.snackBar.open('You are already logged in!', '✔️');
      this.router.navigate(['/home'], { queryParams: { returnUrl } });
      return of(false);
    }
    return of(true);
  }
}
