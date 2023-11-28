import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepositService {

  constructor(private http: HttpClient) {}
  insertEntry(account: string, amount: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const body = {
      account: account,
      amount: amount,
    };   
    return this.http.post(environment.baseUrl + '/transaction/deposit/'+account, body, { headers: headers });
  }
}