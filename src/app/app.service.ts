import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://suitable-wolf-direct.ngrok-free.app/";

  sendForm(data: any) {
    const url = this.baseUrl + "enquiry/enquiryForm"
    return this.http.post(url, data); 
  }
}
