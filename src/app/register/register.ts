import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router) {}

  http = inject(HttpClient);

  title = 'loginpage';
  email: string = '';
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

  login(form: any) {
    if (form.valid) {
      if (
        this.passwordErrors.hasLowercase &&
        this.passwordErrors.hasUppercase &&
        this.passwordErrors.hasDigit &&
        this.passwordErrors.minLength
      ) {
        this.http
          .post('http://localhost:8080/login', {
            param: this.uname,
            password: this.password,
          })
          .subscribe(
            (response) => {
              console.log('Login successful:', response);
              if (response == true) {
                alert('Login successful:');
                this.gotodash();
              } else {
                alert('Login failed: Invalid credentials');
              }
            },
            (error) => {
              console.error('Login failed:', error);
              alert('Login failed. Please try again.');
            }
          );
      } else {
        alert('Password does not meet the requirements');
      }
    } else {
      alert('Form is invalid');
    }
  }
}
