import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { WebPushService } from '../services/webpush_service/webpush.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-push-notification',
  templateUrl: './webpush.component.html',
  styleUrls: ['./webpush.component.css'],
  providers: [WebPushService],
})
export class WebpushComponent {
  isLoggedIn$: Observable<boolean> = of(false);
  sub: PushSubscription | null = null;
  unsub: PushSubscription | null = null;
  notificationResponse = {};
  userId = localStorage.getItem('userId');
  subscribed = localStorage.getItem('sub');

  commonNotification = {
    title: 'KB Bank',
    icon: '../assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Go to the site',
      },
    ],
  };

  VAPID_PUBLIC_KEY = '';
  // 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg';
  // 'BM8sBfpPla7o8yocv8HMuEWLbT7AurG20zciQfVLasrBTNPbdWW4G_6gyZdfqWkPVazJFIT3igimQRkdQZzo6fc';

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
    this.webPushService.getPublicKey().subscribe(
      (publicKey) => {
        let data = JSON.parse(JSON.stringify(publicKey));
        this.VAPID_PUBLIC_KEY = data.payload;
        // You can now use the publicKey in your component
        console.log('My key: ', data.payload);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  showNotification(message: any) {
    console.log('Before notification');
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          // Parse the JSON data received from the backend
          console.log('message body: ', message.body);
          if (message.body == undefined) {
            this.notificationResponse = {
              ...this.commonNotification,
              body: message.message,
            };
            console.log('Default working');

            registration.showNotification('KB Bank', this.notificationResponse);
          }
          let data = message.body;
          if (message.body != undefined) {
            switch (data.type) {
              case 'WITHDRAW':
                this.notificationResponse = {
                  ...this.commonNotification,
                  body: `Cash withdrawal of $${data.amount} from your saving account`,
                };
                break;
              case 'DEPOSIT':
                this.notificationResponse = {
                  ...this.commonNotification,
                  body: `You have deposited $${data.amount} to your saving account`,
                };
                break;
              case 'RECEIVER':
                console.log('Im a receiver');

                this.notificationResponse = {
                  ...this.commonNotification,
                  body: `You have received $${data.amount} from ${data.receivedAccountNumber} account`,
                };
                break;
              case 'SENDER':
                console.log('Im a sender');

                this.notificationResponse = {
                  ...this.commonNotification,
                  body: `You have transferred $${data.amount} to ${data.receivedAccountNumber} account`,
                };
                break;
              default:
                // Handle other cases or provide a default notificationResponse
                break;
            }

            registration.showNotification('KB Bank', this.notificationResponse);
          }
        });
      }

      console.log('Receive message: ', message);
    }
  }

  subscribeToNotifications() {
    console.log('subscribed: ', this.subscribed);

    if (this.subscribed == 'false' || this.subscribed == null) {
      this.webPushService.getPublicKey().subscribe(
        (publicKey) => {
          let data = JSON.parse(JSON.stringify(publicKey));
          this.VAPID_PUBLIC_KEY = data.payload;
          // You can now use the publicKey in your component
          console.log('My key: ', data.payload);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((sub) => {
          console.log('Notification Subscription: ', sub.getKey('auth'));
          console.log('Notification p256dh: ', sub.getKey('p256dh'));
          console.log('Notification userId: ', this.userId);

          this.webPushService.addPushSubscriber(sub, this.userId).subscribe(
            () => {
              this.sub = sub;
              localStorage.setItem('sub', 'true');
              console.log('Sent push subscription object to server.');
            },
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
    } else {
      console.log('You already have a subscription');
    }
  }

  unsubscribe() {
    const self = this;
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager.getSubscription().then(function (subscription) {
        console.log('log ', subscription);

        if (subscription) {
          subscription.unsubscribe().then(function (success) {
            if (success) {
              const originalUrl = subscription.endpoint;
              const substringToRemove = 'https://fcm.googleapis.com/fcm/send/';
              const modifiedUrl = originalUrl.replace(substringToRemove, '');
              self.webPushService.unsubscribe(modifiedUrl).subscribe(
                () => {
                  self.unsub = subscription;
                  self.sub = null;
                  localStorage.setItem('sub', 'false');
                  console.log('Sent push subscription object to server.');
                },
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

  sendToSpecificUser() {
    console.log('Sending Newsletter to all Subscribers ...');
    const notificationPayload = {
      title: 'Hello',
      body: 'How are you?',
    };

    this.webPushService
      .sendToSpecificUser(notificationPayload, this.userId)
      .subscribe();
  }
}
