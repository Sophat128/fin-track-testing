import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  

  constructor(private http: HttpClient) {}

  insertEntry(account: string, amount: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    let accountNumber = String(account).padStart(10, '0');

    
    const body = {
      account: account,
      amount: amount,
    };
    return this.http.post(environment.baseUrl + '/transaction/withdraw/' + accountNumber, body, { headers: headers });
  }
}