import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends DataService{

  constructor(http:HttpClient,private httpPrivate : HttpClient){
    super(`${environment.apiUrl}deliveries`,http);
  }
}