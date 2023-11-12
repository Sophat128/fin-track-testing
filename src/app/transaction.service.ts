import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get(environment.baseUrl  + '/transaction/history/' + accNo);
  }
  public getSavingAccount(username:any): Observable<SavingAccount> {
    return this.http.get<SavingAccount>(
      environment.baseUrl + '/account/getsaving/' + username
    );
  }
}