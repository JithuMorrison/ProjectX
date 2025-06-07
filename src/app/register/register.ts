import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Relog } from '../relog';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router) {}

  http = inject(HttpClient);
  relog = inject(Relog);

  title = 'Registerpage';
  uname: string = '';
  fname: string = '';
  lname: string = '';
  password: string = '';

  passwordErrors = {
    hasLowercase: true,
    hasUppercase: true,
    hasDigit: true,
    minLength: true,
  };

  validatePassword(value: string) {
    this.passwordErrors.hasLowercase = /[a-z]/.test(value);
    this.passwordErrors.hasUppercase = /[A-Z]/.test(value);
    this.passwordErrors.hasDigit = /\d/.test(value);
    this.passwordErrors.minLength = value.length >= 8;
  }

  gotodash() {
    this.router.navigate(['/dash'], { queryParams: { name: this.uname } });
  }

  onEmailChange(value: string) {
    this.relog.userdetails.email.set(value);
  }

  onUsernameChange(value: string) {
    this.uname = value;
  }

  onfirstnameChange(value: string) {
    this.fname = value;
  }

  onPasswordChange(value: string) {
    this.password = value;
    this.validatePassword(value);
  }

  register(form: any) {
    if (form.valid && this.uname && this.fname && this.password) {
      if (
        this.passwordErrors.hasLowercase &&
        this.passwordErrors.hasUppercase &&
        this.passwordErrors.hasDigit &&
        this.passwordErrors.minLength
      ) {
        this.http
          .get<boolean>(
            'http://localhost:8080/getUser?email=' +
              this.relog.userdetails.email
          )
          .subscribe((response: any) => {
            if (response) {
              alert('User already exists with this email');
            } else {
              this.http
                .post('http://localhost:8080/register', {
                  email: this.relog.userdetails.email,
                  username: this.uname,
                  fname: this.fname,
                  password: this.password,
                })
                .subscribe(
                  (response) => {
                    console.log('Registration successful:', response);
                    alert('Registration successful');
                    this.gotodash();
                  },
                  (error) => {
                    console.error('Registration failed:', error);
                    alert('Registration failed');
                  }
                );
            }
          });
      } else {
        alert('Password does not meet the requirements');
      }
    } else {
      alert('Please fill in all fields');
    }
  }
}
