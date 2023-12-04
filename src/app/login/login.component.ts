import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../models';
import { LoginService } from '../login.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { WebPushService } from '../services/webpush_service/webpush.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [WebPushService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '';
  isLoginError: boolean = false;

  isLoggedIn$: Observable<boolean> = of(false);
  sub: PushSubscription | null = null;
  unsub: PushSubscription | null = null;
  notificationResponse = {};
  // userId = localStorage.getItem('userId');
  subscribed = localStorage.getItem('sub');
  VAPID_PUBLIC_KEY = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private swPush: SwPush,
    public webPushService: WebPushService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.webPushService.getPublicKey().subscribe(
      (publicKey) => {
        let data = JSON.parse(JSON.stringify(publicKey));
        this.VAPID_PUBLIC_KEY = data.payload.publicKey;
        // You can now use the publicKey in your component
        console.log('My key init: ', data.payload.publicKey);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  get fval() {
    return this.loginForm.controls;
  }

  onFormSubmit() {
    console.log('Work');

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const result: Login = Object.assign({}, this.loginForm.value);

    this.loginService.loginUser(result).subscribe({
      next: (res) => {
        console.log('Loggin data: ', res);

        localStorage.setItem('token', res.loginResponse.access_token);
        localStorage.setItem('refresh_token', res.loginResponse.refresh_token);
        this.loginForm.reset();

        // Decode the JWT
        const decodedToken = JSON.parse(
          atob(res.loginResponse.access_token.split('.')[1])
        );

        console.log('decodedToken: ', decodedToken);

        // Extract user information
        const userId = decodedToken.sub;
        const username = decodedToken.preferred_username;
        console.log('username: ', username);

        this.authService.authenticate(true);
        this.authService.setUserName(username);

        localStorage.setItem('login', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);

        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 2000,
        });
        this.router.navigate(['/home']);
        console.log('Redirect');
        setTimeout(() => {
          this.subscribeToNotifications(userId);
        }, 3000);

        // this._router.navigate(['/beginning']);
      },
      error: (err) => {
        console.log('Error: ', err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error,
        });
        this.authService.authenticate(false);
        this.loading = false;
      },
    });
  }

  subscribeToNotifications(userId:string) {
    console.log('subscribed: ', this.subscribed);
    console.log('UserId: ', userId);
    // if (this.subscribed == 'true') {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Oops...',
    //     text: 'You have subscribed already!!!',
    //   });
    // }
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
          console.log('Notification userId: ', userId);

          Swal.fire({
            title: 'Do you want to get notification alert?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Allow',
            denyButtonText: `Not Allow`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // Swal.fire('Allowed!', '', 'success');
              this.webPushService.addPushSubscriber(sub, userId).subscribe(
                () => {
                  this.sub = sub;
                  localStorage.setItem('sub', 'true');
                  Swal.fire({
                    icon: 'success',
                    title: 'Subscribe successfully',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  console.log('Sent push subscription object to server.');
                },
                (err) => {
                  console.log(
                    'Could not send subscription object to server, reason: ',
                    err
                  );

                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.error,
                  });
                }
              );
            } else if (result.isDenied) {
              Swal.fire('Not Allow', '', 'info');
            }
          });

          // this.webPushService.addPushSubscriber(sub, this.userId).subscribe(
          //   () => {
          //     this.sub = sub;
          //     localStorage.setItem('sub', 'true');
          //     Swal.fire({
          //       icon: 'success',
          //       title: 'Subscribe successfully',
          //       showConfirmButton: false,
          //       timer: 2000,
          //     });
          //     console.log('Sent push subscription object to server.');
          //   },
          //   (err) => {
          //     console.log(
          //       'Could not send subscription object to server, reason: ',
          //       err
          //     );

          //     Swal.fire({
          //       icon: 'error',
          //       title: 'Oops...',
          //       text: err.error,
          //     });
          //   }
          // );
        })
        .catch((err) =>
          console.error('Could not subscribe to notifications', err)
        );
    } else {
      console.log('You already have a subscription');
    }
  }
}
