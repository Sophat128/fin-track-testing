import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  

  constructor(private http: HttpClient) {}

  update(
    username: string | null ,
    phone: string,
    email: string ,
    address: string ,
    prevpassword: string ,
    newpassword: string
  ) {
    const body = {
      username: username,
      phone: phone,
      email: email,
      address: address,
      password: prevpassword,
      newpassword: newpassword,
    };
    return this.http.put( environment.baseUrl+ '/profile/update', body);
  }
}