import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {


  constructor(private http: HttpClient) { }

  insertUser(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    phone: string,
    accountNumber: string,
    balance: number,
    email: string
  ) {
    const body = {
      fname: firstName,
      lname: lastName,
      username: userName,
      password: password,
      phone: phone,
      accountNumber: accountNumber,
      balance: balance,
      email: email,
    };


    return this.http.post(environment.baseUrl + '/auth/clients/register', body);
  }
}