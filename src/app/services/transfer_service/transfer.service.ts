import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TransferService {

  constructor(private http: HttpClient) { }

  insertEntry(
    savingAccount: string,
    primaryAccount: string,
    amount: number
  ) {
    const body = {
     
      amount: amount,
    };
    console.log(body);
    return this.http.post(environment.baseUrl + `/transaction/transfer/${savingAccount}/${primaryAccount}`, body);
  }
}