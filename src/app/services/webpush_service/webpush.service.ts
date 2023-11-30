import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn:'root'
})
export class WebPushService {
  constructor(private http: HttpClient) {}

  getPublicKey(){
    return this.http.get('https://api.fintrack.dev/fintrack-web-push-service/api/v1/webpush/vapidKeys');
  }

  addPushSubscriber(sub: any, userId:string|null) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.post('https://api.fintrack.dev/fintrack-web-push-service/api/v1/webpush/subscribe/' + userId, sub);
  }
  unsubscribe(endpoint: string) {
    // return this.http.post('http://localhost:9000/api/notifications', sub);
    return this.http.delete('https://api.fintrack.dev/fintrack-web-push-service/api/v1/webpush/unsubscribe/' + endpoint);
  }

  send(notification: any) {
  
    return this.http.post(
      'https://api.fintrack.dev/fintrack-web-push-service/api/v1/webpush/send_notification',
      notification
    );

  }
  sendToSpecificUser(notification: any, userId:string|null) {
    return this.http.post(
      'https://api.fintrack.dev/fintrack-web-push-service/api/v1/webpush/send_notification_user/' + userId,
      notification
    );

  }
}
