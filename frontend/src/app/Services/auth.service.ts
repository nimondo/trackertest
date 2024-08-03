import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import jwt_decode from 'jwt-decode';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  public saveToken(token: string): void {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.setItem("token", token);
  }
  public saveUserData(userId: string, role: string, email: string ): void {
    window.sessionStorage.removeItem("userData");
    window.sessionStorage.setItem("userData", JSON.stringify({"userId": userId, "email":email, "role":role}));
  }
  public getUser(): string | null {
    const userData = this.getUserData() ? JSON.parse(this.getUserData()):null;
    const email = userData != null ? userData.email: null;
    return email;
  }
  public getUserId(): string | null {
    const userData = this.getUserData() ? JSON.parse(this.getUserData()):null;
    const userId = userData != null ? userData.userId: null;
    return userId;
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem("token") !== null
      ? window.sessionStorage.getItem("token")
      : null;
  }
  public getUserData(): any | null {
    return window.sessionStorage.getItem("userData") !== null
      ? window.sessionStorage.getItem("userData")
      : null;
  }

  public getRole() {
    const userData = this.getUserData() ? JSON.parse(this.getUserData()):null;
    const userRole = userData != null ? userData.role: null;
    return userRole;
  }

  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
