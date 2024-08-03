import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends DataService {
  apiUrl: string = environment.apiUrl;
  constructor(http: HttpClient, private httpPrivate: HttpClient) {
    super(`${environment.apiUrl}auth/signup`, http);
  }

  // Login Method
  signIn(data: { email: string; password: string }): Observable<any> {
    return this.httpPrivate.post(`${this.apiUrl}auth/login`, data);
  }
}
