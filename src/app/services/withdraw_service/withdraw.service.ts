import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  

  constructor(private http: HttpClient) {}

  insertEntry(account: string, amount: number) {
    let accountNumber = String(account).padStart(10, '0');
    console.log("Account: ", accountNumber);

    
    const body = {
      account: account,
      amount: amount,
    };
    console.log(body);
    return this.http.post(environment.baseUrl + '/transaction/withdraw/' + accountNumber, body);
  }
}