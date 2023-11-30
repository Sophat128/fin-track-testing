import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../services/user_service/user.service';
import { Router, ActivatedRoute } from '@angular/router';

import { TransferhistoryService } from '../services/transfer_service/transfer-history.service';
import { TransactionService } from '../transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userId = localStorage.getItem('userId');
  username = localStorage.getItem('username');
  private accNo = localStorage.getItem('savingAccNo');
  private bankAccountNumber = localStorage.getItem('savingAccNo');
  savingAcc!: string;
  // primaryAcc: number;
  savingBalanceLocal!: number;
  // primaryBalanceLocal: number;
  transaction: any = {
    count: 0,
    deposit: 0,
    withdraw: 0,
    total: 0,
  };
  transfer = 0;

  constructor(
    public userService: UserService,
    private transactionService: TransactionService,
    private transferService: TransferhistoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.userId).subscribe((res) => {
      console.log('res: ', res);
      this.savingAcc = res.payload.bankAccountNumber;
      this.savingBalanceLocal = res.payload.currentBalance;
      localStorage.setItem('savingAccNo', this.savingAcc);
    });

    this.transactionService
      .getTransactions(this.bankAccountNumber)
      .subscribe((res) => {
        console.log('Dara res: ', res);

        if (res) {
          this.transaction.count = res.payload.length;
          res.payload.forEach((item: any) => {
            if (item.type == 'DEPOSIT') {
              console.log('DEPOSIT');

              this.transaction.deposit += item.amount;
            } else if (item.type == 'WITHDRAW') {
              console.log('WITHDRAW');

              this.transaction.withdraw += item.amount;
            } else {
              this.transfer += item.amount;
            }
          });
          this.transaction.total =
            this.transaction.withdraw + this.transaction.deposit;
        }
      });

    const chatId = this.activatedRoute.snapshot.queryParams['chatId'];
    if (chatId !== undefined) {
      const isSubscribedTelegram = localStorage.getItem('isSubscribedTelegram');

      if (isSubscribedTelegram == 'false' || isSubscribedTelegram == null) {
        this.subscribeTelegram(chatId);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'You have already bound your account!!!',
        });
      }
    }
    // this.transferService.getTransferHistory(this.accNo).subscribe(res => {
    //   if (res) {
    //     res.forEach(item => {
    //       this.transfer += item.amount;
    //     })
    //   }
    // });
  }

  subscribeTelegram(chatId: any) {
    this.userService.subscribeTelegram(chatId).subscribe({
      next: () => {
        localStorage.setItem('isSubscribedTelegram', 'true');
        Swal.fire({
          icon: 'success',
          title: 'You are successfully bind your account',
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error,
        });
      },
    });
  }

  displayuserdetails() {
    this.userService.getUser(this.userId).subscribe(() => this.ngOnInit());
  }
}
