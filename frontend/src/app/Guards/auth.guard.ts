import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private _snackBar: MatSnackBar,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const jwtToken = this.authService.getToken();
    // const decodedToken: any =
    //   this.authService.getToken() != null
    //     ? jwt_decode(jwtToken as string)
    //     : null;
    const userRole = this.authService.getRole();

    if (!jwtToken || this.jwtHelper.isTokenExpired(jwtToken)) {
      // Check if the token is missing or expired
      if (this.jwtHelper.isTokenExpired(this.authService.getToken())) {
        this._snackBar.open(
          'Your session has expired. Please log in again.',
          '❌'
        );
        this.authService.signOut();
        this.router.navigate(['/signin'], {
          queryParams: { returnUrl: state.url },
        });
      } else {
        this._snackBar.open('Access Denied!', '❌');
        this.router.navigate(['/signin'], {
          queryParams: { returnUrl: state.url },
        });
      }
    } else {
      // console.log(route.data['role'], userRole);
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        // Check if the user's role is not granted access
        this._snackBar.open('Access Denied! Role Not Granted.', '❌');
        this.router.navigate(['/home'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      } else {
        return true;
      }
    }

    return true;
  }
}
