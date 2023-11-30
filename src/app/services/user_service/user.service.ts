import { Injectable } from '@angular/core';
import { UserDisplay } from '../../models/userdisplay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public getUser(userId:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(environment.baseUrl + '/bank/bankInfo/' + userId, { headers: headers });
  }


  public subscribeTelegram(chatId:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const token = localStorage.getItem('token')
    return this.http.get(`http://localhost:8082/api/v1/telegram/users/subscribed?chat_id=${chatId}&token=${token}` , { headers: headers });
  }

}