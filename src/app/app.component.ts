import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { WebPushService } from './services/webpush.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebPushService],
})
export class AppComponent implements OnInit {
  title = 'hello';

  sub: PushSubscription | null = null;
  unsub: PushSubscription | null = null;

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    public webPushService: WebPushService
  ) {}
  readonly VAPID_PUBLIC_KEY =
    'BM8sBfpPla7o8yocv8HMuEWLbT7AurG20zciQfVLasrBTNPbdWW4G_6gyZdfqWkPVazJFIT3igimQRkdQZzo6fc';

  ngOnInit() {
    console.log(" hello");
    

    const hasSubscribed = localStorage.getItem('hasSubscribed') === 'true';
    if (!hasSubscribed) {
      this.subscribeToNotifications();
      console.log("subscribe: ", this.sub);
      
    }

    if (this.swUpdate.isEnabled) {

      console.log("loading");
        this.swUpdate.available.subscribe(() => {

            if (confirm("New version available. Load New Version?")) {
              console.log("Yes Im inside this b")
                window.location.reload();
            }
        });

    }
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        localStorage.setItem('hasSubscribed', 'true');

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
}
