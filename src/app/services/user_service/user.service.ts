import { Injectable } from '@angular/core';
import { UserDisplay } from '../../models/userdisplay';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public getUser(userId:any): Observable<any> {
    return this.http.get(environment.baseUrl + '/bank/account/bankInfo/' + userId);
  }

}