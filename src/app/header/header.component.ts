import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn!: Observable<boolean>;
  isRegsiter!: Observable<boolean>;
  user!: Observable<string>;
  isShow = false;
  isMobileNav = false;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.user = this.authService.userName;
    this.isRegsiter = this.authService.isRegisterPage;

  }

  toggleMenu() {
    this.isShow = !this.isShow;
  }

  toggleNav(){
    this.isMobileNav = !this.isMobileNav;
  }

  logOut() {
    localStorage.setItem('login', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('savingAccNo');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    this.isShow = !this.isShow;
    this.authService.authenticate(false);
    Swal.fire({
      icon: 'success',
      title: 'Logout successfully',
      showConfirmButton: false,
      timer: 2000,
    });

  }

}
