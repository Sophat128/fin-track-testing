import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { WebPushService } from '../services/webpush_service/webpush.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    icon: '../assets/kb_logo.png',
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
        this.VAPID_PUBLIC_KEY = data.payload.publicKey;
        // You can now use the publicKey in your component
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  showNotification(message: any) {
    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          // Parse the JSON data received from the backend

          if (message.body == undefined) {
            this.notificationResponse = {
              ...this.commonNotification,
              body: message.message,
            };

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
    if(this.subscribed == 'true') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: "You have subscribed already!!!",
      });
    }
    if (this.subscribed == 'false' || this.subscribed == null) {
      this.webPushService.getPublicKey().subscribe(
        (publicKey) => {
          let data = JSON.parse(JSON.stringify(publicKey));
          this.VAPID_PUBLIC_KEY = data.payload;
          // You can now use the publicKey in your component
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
              Swal.fire({
                icon: 'success',
                title: 'Subscribe successfully',
                showConfirmButton: false,
                timer: 2000,
              });
            },
            (err) => {
              

              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.error.message,
              });
            }
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

    if(this.subscribed == 'false') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: "You have not subscribed yet!!!",
      });
    }

    const self = this;
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager.getSubscription().then(function (subscription) {

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
                  Swal.fire({
                    icon: 'success',
                    title: 'Unsubscribe successfully',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  console.log('Sent push subscription object to server.');
                },
                (err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.error,
                  });
                  console.log(
                    'Could not send subscription object to server, reason: ',
                    err
                  );
                }
              );

              console.log('Unsubscribed successfully');
            }
          });
        }
      });
    });
  }

  
}
