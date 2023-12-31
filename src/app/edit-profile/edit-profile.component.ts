import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateService } from '../services/user_service/update.service';
import { UserUpdate } from '../models/userupdate';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username = localStorage.getItem("username");

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private updateService: UpdateService
  ) { }

  updateForm!: FormGroup;
  loading = false;
  submitted = false;


  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      phone: [''],
      address: [''],
      email: ['', [Validators.email]],
      prevpassword: ['', [Validators.minLength(4)]],
      password: ['', [Validators.minLength(4)]]

    });
  }
  get fval() { return this.updateForm.controls; }

  update() {
    this.submitted = true;
    // return for here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }
    this.loading = true;
    const result: UserUpdate = Object.assign({}, this.updateForm.value);
    try {
      this.updateService.update(this.username, result.phone, result.email, result.address, result.prevpassword, result.password).subscribe(
        (data: any) => {
         
          this.loading = false;
          if (data.flag == true) {
            Swal.fire(
              {
                icon: 'success',
                title: 'Profile updated successfully!',
                text: data.message
              }
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: data.message,
            })
          }
          this.router.navigate(['/editProfile']);

        }
      );
    } catch {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Something went wrong!"
      })
    }

  }
}