import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models';
import { RegisterService } from '../register.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { BankService } from '../services/bank_service/bank.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private authService: AuthService,
    private bankService: BankService
  ) {}
  identityType = [
    { name: 'Aadhar Card', value: 'aadhar' },
    { name: 'PAN card', value: 'pancard' },
    { name: 'Passport', value: 'passport' },
    { name: 'Voter Id Card', value: 'voter' },
  ];
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  selectedOption: string = '';
  ngOnInit() {
    let randomNumber = Math.floor(100000 + Math.random() * 900000);
    let randomAccountNumber = String(randomNumber).padStart(10, '0');
    this.authService.setRegisterPageStatus(true);
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      accountNumber: [
        randomAccountNumber,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      balance: [0, [Validators.required, this.validateMinBalance]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get fval() {
    return this.registerForm.controls;
  }
  validateMinBalance(control: AbstractControl): ValidationErrors | null {
    const balance = control.value;
    if (balance !== null && balance < 5) {
      return { minBalance: true };
    }
    return null;
  }

  onFormSubmit() {
    this.submitted = true;
    // return for here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const result: User = Object.assign({}, this.registerForm.value);

    // Do useful stuff with the gathered data
    console.log(result.firstName);
    console.log(this.selectedOption);

    this.registerService
      .insertUser(
        result.userName,
        result.firstName,
        result.lastName,
        result.phone,
        result.email,
        result.password
      )
      .subscribe((data: any) => {
        console.log('Data: ', data.payload);

        this.loading = false;
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(data.payload));
        // this.bankService.createBankAccount(data.payload.id, result.accountNumber, result.balance)
        if (data.status == 200) {
          Swal.fire({
            icon: 'success',
            title: 'User registered succesfully!',
            text: 'Please wait for an email for account activation!',
          });
          this.bankService
            .createBankAccount(
              data.payload.id,
              result.accountNumber,
              result.balance
            )
            .subscribe(() => {
              console.log("It's working");
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.responseMessage,
          });
        }
        this.router.navigate(['/login']);
      });
  }

  // filterSelected(selectedOption) {
  //   this.selectedOption = selectedOption;
  //   console.log('selected value = ' + selectedOption);
  // }
}
