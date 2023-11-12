import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../models';
import { LoginService } from '../login.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '';
  isLoginError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
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
        localStorage.setItem('token', res.loginResponse.access_token);
        localStorage.setItem('refresh_token', res.loginResponse.refresh_token);
        this.loginForm.reset();

        // Decode the JWT
        const decodedToken = JSON.parse(
          atob(res.loginResponse.access_token.split('.')[1])
        );

        console.log("decodedToken: ", decodedToken);
        
        // Extract user information
        const userId = decodedToken.sub;
        const username = decodedToken.preferred_username;
        console.log("username: ", username);
        

        this.authService.authenticate(true);
        this.authService.setUserName(username);

        localStorage.setItem('login', "true");
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);


        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 2000,
        });
        this.router.navigate(['/home']);
        console.log("Redirect");
        
        // this._router.navigate(['/beginning']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
        });
        this.authService.authenticate(false);
        this.loading = false;
      },
    });
  }
}
