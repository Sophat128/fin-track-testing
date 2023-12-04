import { Component } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { WebPushService } from './services/webpush_service/webpush.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'KB bank';
  sub: PushSubscription | null = null;
  userId = localStorage.getItem('userId');
  isLogin = localStorage.getItem('login');

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    public webPushService: WebPushService
  ) {}

  VAPID_PUBLIC_KEY = '';
    

  ngOnInit() {
    this.webPushService.getPublicKey().subscribe(
      (publicKey) => {
        let data = JSON.parse(JSON.stringify(publicKey));
        this.VAPID_PUBLIC_KEY = data.payload.publicKey;
        // You can now use the publicKey in your component
      },
      (error) => {
        console.error('Error:', error);
      }
    );

    if (this.isLogin === 'true' && !this.hasSubscribedBefore()) {
      this.subscribeToNotifications();
      this.setHasSubscribed();
    }
  }
  hasSubscribedBefore() {
    const hasSubscribed = localStorage.getItem('hasSubscribed') === 'true';
    return hasSubscribed;
  }
  setHasSubscribed() {
    localStorage.setItem('hasSubscribed', 'true');
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        console.log('Notification Subscription: ', sub.getKey('auth'));

        this.webPushService.addPushSubscriber(sub, this.userId).subscribe(
          () => console.log('Sent push subscription object to server.'),
          (err) =>
            console.log(
              'Could not send subscription object to server, reason: ',
              err
            )
        );
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }
}
