import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WebPushService {
  constructor(private http: HttpClient) {}

  addPushSubscriber(sub: any) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.post('http://localhost:8084/subscribe', sub);
  }

  unsubscribe(sub: any) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.post('http://localhost:8084/unsubscribe', sub);
  }

  send(notification: any) {
  
    return this.http.post(
      'http://localhost:8084/send_notification',
      notification
    );

  }
  sendToSpecificUser(notification: any) {
    return this.http.post(
      'http://localhost:8084/send_notification_user',
      notification
    );

  }
}
