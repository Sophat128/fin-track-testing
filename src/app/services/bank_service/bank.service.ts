import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) {}
  createBankAccount(customerId:string, account: string, balance: number) {
    const body = {
      accountNumber: account,
      balance: balance,
    };   
    return this.http.put(environment.baseUrl + '/bank/'+customerId, body);
  }
}
