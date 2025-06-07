import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Relog } from '../relog';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) {}

  http = inject(HttpClient);
  relog = inject(Relog);

  title = 'loginpage';
  uname: string = '';
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
            param: this.relog.userdetails.email(),
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
