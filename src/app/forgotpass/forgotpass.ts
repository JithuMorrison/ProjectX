import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Relog } from '../relog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgotpass',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgotpass.html',
  styleUrl: './forgotpass.css',
})
export class Forgotpass {
  http = inject(HttpClient);
  router = inject(Router);
  relog = inject(Relog);

  email: string = '';
  newPassword: string = '';

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

  onPasswordChange(value: string) {
    this.newPassword = value;
    this.validatePassword(value);
  }

  onEmailChange(value: string) {
    this.email = value;
  }

  resetPassword() {
    this.http
      .put(
        `http://localhost:8080/updateUserpass/${this.email}`,
        this.newPassword,
        { responseType: 'text' }
      )
      .subscribe({
        next: (res) => {
          alert('Password Changed Successfully');
          this.router.navigate(['/']);
        },
        error: (err) => alert('Password not updated :('),
      });
  }
}
