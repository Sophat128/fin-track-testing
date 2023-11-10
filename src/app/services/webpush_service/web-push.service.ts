import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebPushService {
  constructor(private http: HttpClient) {}

  getPublicKey(){
    return this.http.get('http://localhost:8084/api/v1/webpush/publicKey');
  }

  addPushSubscriber(sub: any) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.post('http://localhost:8084/api/v1/webpush/subscribe', sub);
  }
  unsubscribe(sub: any) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.post('http://localhost:8084/api/v1/webpush/unsubscribe', sub);
  }

  send(notification: any) {
  
    return this.http.post(
      'http://localhost:8084/api/v1/webpush/send_notification',
      notification
    );

  }
  sendToSpecificUser(notification: any) {
    return this.http.post(
      'http://localhost:8084/api/v1/webpush/send_notification_user',
      notification
    );

  }
}
