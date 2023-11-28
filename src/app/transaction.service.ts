import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from './models/transaction';
import { SavingAccount } from './models/savingaccount';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {


  constructor(private http: HttpClient) {
   
  }
  public getTransactions(accNo:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(environment.baseUrl  + '/transaction/history/' + accNo, { headers: headers });
  }
  public getUserInfo(userId:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(environment.baseUrl + '/bank/bankInfo/' + userId, { headers: headers });
  }
}