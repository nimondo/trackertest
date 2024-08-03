import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Inject ApiUrl in constructor to Get it form ather Service
  constructor(
    @Inject(String) private APIUrl: string,
    private http: HttpClient
  ) {}

  // Get Method
  getAll(page: any = 0): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}?page=${page}`);
  }
  // Get with id
  get(id: any): Observable<any> {
    return this.http.get(`${this.APIUrl}/${id}`);
  }
  // Update Method
  Update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/${id}`, data);
  }
  // Create Method
  Create(data: any): Observable<any> {
    return this.http.post(this.APIUrl, data);
  }
  // Delete Method
  Delete(id: any): Observable<any> {
    return this.http.delete(`${this.APIUrl}/${id}`);
  }
}
