import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { WebPushService } from '../services/webpush.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'lessons',
  templateUrl: './webpush.component.html',
  styleUrls: ['./webpush.component.css'],
  providers: [WebPushService],
})
export class LessonsComponent {
  isLoggedIn$: Observable<boolean> = of(false);
  sub: PushSubscription | null = null;
  unsub: PushSubscription | null = null;

  readonly VAPID_PUBLIC_KEY =
    // 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg';
    'BM8sBfpPla7o8yocv8HMuEWLbT7AurG20zciQfVLasrBTNPbdWW4G_6gyZdfqWkPVazJFIT3igimQRkdQZzo6fc';

  constructor(
    private swPush: SwPush,
    public webPushService: WebPushService,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.swPush.messages.subscribe((message) => {
      // Handle the incoming push notification message
      console.log('Received push message:', message);
      this.showNotification(message);
    });
  }

  showNotification(message: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          const options = {
            body: message.body,
            icon: 'notification-icon.png', // Replace with the path to your notification icon
          };

          registration.showNotification('Push Notification', options);
        });
      }

     console.log('Receive message: ', message);
    }
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        this.sub = sub;

        console.log('Notification Subscription: ', sub.getKey('auth'));

        this.webPushService.addPushSubscriber(sub).subscribe(
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

  unsubscribe() {
    const self = this;

    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager.getSubscription().then(function (subscription) {
        console.log('log ', subscription);

        if (subscription) {
          self.unsub = subscription;
          self.sub = null;
          subscription.unsubscribe().then(function (success) {
            if (success) {
              self.webPushService.unsubscribe(subscription).subscribe(
                () => console.log('Sent push subscription object to server.'),
                (err) =>
                  console.log(
                    'Could not send subscription object to server, reason: ',
                    err
                  )
              );

              console.log('Unsubscribed successfully');
            }
          });
        }
      });
    });
  }

  sendNewsletter() {
    console.log('Sending Newsletter to all Subscribers ...');
    const notificationPayload = {
      title: 'Hello',
      body: 'What is your name?',
    };

    this.webPushService.send(notificationPayload).subscribe();
  }

  sendToSpecificUser(){
    console.log('Sending Newsletter to all Subscribers ...');
    const notificationPayload = {
      title: 'Hello',
      body: 'How are you?',
    };

    this.webPushService.sendToSpecificUser(notificationPayload).subscribe();
  }

  link(id: number) {
    this.router.navigate(['/lessons', id]);
  }
}
