import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {


  constructor(private http: HttpClient) { }

  insertUser(
    userName: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    password: string
  ) {
    const body = {
      username: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: password
    };


    return this.http.post(environment.baseUrl + '/auth/clients/register', body);
  }
}