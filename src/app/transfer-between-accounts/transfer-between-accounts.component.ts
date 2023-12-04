import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransferService } from '../services/transfer_service/transfer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer-between-accounts',
  templateUrl: './transfer-between-accounts.component.html',
  styleUrls: ['./transfer-between-accounts.component.css'],
})
export class TransferBetweenAccountsComponent implements OnInit {
  transferForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private transferService: TransferService
  ) {}

  ngOnInit() {
    var username = localStorage.getItem('username');
    var accNo = localStorage.getItem('savingAccNo');
    this.transferForm = this.formBuilder.group({
      savingAccount: accNo,
      primaryAccount: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }
  get savingAccount(): any {
    return localStorage.getItem('savingAccNo');
  }
  get fval() {
    return this.transferForm.controls;
  }

  transfer() {
    this.submitted = true;
    if (this.transferForm.invalid) {
      return;
    }
    this.loading = true;
    const result: any = Object.assign({}, this.transferForm.value);

    /*** Sample Data *******************
    {        
      "savingAccount":"39149182025",
      "primaryAccount":"39149182015",
      "ifsc":"ICIN7465",
      "amount":"500",
      "date":"30-08-2022",
      "username": "pravin"
    }
    ***********************************/

    // Do useful stuff with the gathered data
    try {
      this.transferService
        .insertEntry(result.savingAccount, result.primaryAccount, result.amount)
        .subscribe({
          next: (data: any) => {
            this.loading = false;
            if (data.status == 200) {
              Swal.fire({
                icon: 'success',
                title: 'Transaction successful',
                text: data.message,
              });
            }
          },
          error: (err) => {

            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.message,
            });

            if (err.status == 400) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid amount',
              });
            }
          },
        });
    } catch {
      this.loading = false;
    }
  }
}
