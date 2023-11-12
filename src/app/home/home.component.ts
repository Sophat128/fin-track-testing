import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../services/user_service/user.service';
import { Router } from '@angular/router';

import { TransferhistoryService } from '../services/transfer_service/transfer-history.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userId = localStorage.getItem("userId");
  username = localStorage.getItem("username");
  private accNo = localStorage.getItem("savingAccNo");
  private bankAccountNumber = localStorage.getItem("savingAccNo");
  savingAcc!: string;
  // primaryAcc: number;
  savingBalanceLocal!: number;
  // primaryBalanceLocal: number;
  transaction: any = {
    count: 0,
    deposit: 0,
    withdraw: 0,
    total: 0
  };
  transfer = 0;

  constructor(
    public userService: UserService,
    private transactionService: TransactionService,
    private transferService: TransferhistoryService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.userService.getUser(this.userId).subscribe(res => {
      console.log("res: ", res);
      this.savingAcc = res.bankAccountNumber;
      this.savingBalanceLocal = res.currentBalance;
      localStorage.setItem("savingAccNo", this.savingAcc);
    });

    
    this.transactionService.getTransactions(this.bankAccountNumber).subscribe((res) => {
      console.log("Dara res: ", res);
      
      if (res) {
        this.transaction.count = res.payload.length;
        res.payload.forEach((item:any) => {
          if (item.type == 'DEPOSIT') {
            console.log("DEPOSIT");
            
            this.transaction.deposit += item.amount;
          } else if(item.type == 'WITHDRAW'){
            console.log("WITHDRAW");

            this.transaction.withdraw += item.amount;
          }else{
          this.transfer += item.amount;

          }
        });
        this.transaction.total = this.transaction.withdraw + this.transaction.deposit;
      }
    });

    // this.transferService.getTransferHistory(this.accNo).subscribe(res => {
    //   if (res) {
    //     res.forEach(item => {
    //       this.transfer += item.amount;
    //     })
    //   }
    // });
  }

  displayuserdetails() {
    this.userService.getUser(this.userId).subscribe(() => this.ngOnInit());
  }

}