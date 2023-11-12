import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Login } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser(authenticationRequest: Login): Observable<any> {
    
    return this.http.post(environment.baseUrl + '/auth/clients/login', authenticationRequest);
  }
  
}