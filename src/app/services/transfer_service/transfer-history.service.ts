import { Injectable } from '@angular/core';
import { TransferHistory } from '../../models/transferhistory';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TransferhistoryService {
  // private url: String;

  constructor(private http: HttpClient) { }
  
  public getTransferHistory(accNo:any): Observable<TransferHistory[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get<TransferHistory[]>(
      environment.baseUrl+ '/account/getTransfers/' + accNo
    , { headers: headers });
  }
  // public getSavingAccount(username):Observable<SavingAccount>{
  //   return this.http.get<SavingAccount>(this.url+"/account/getsaving/"+username);
  // }
}