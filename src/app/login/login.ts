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

  updateStatus(status: string) {
    const userId = this.relog.userdetails.id();
    if (!userId) return;

    const payload = { status };

    this.http
      .put(`http://localhost:8080/updateStatus/${userId}`, payload, {
        responseType: 'text',
      })
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error('Error updating status:', err),
      });
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
          .post<any>('http://localhost:8080/login', {
            param: this.relog.userdetails.email(),
            password: this.password,
          })
          .subscribe(
            (response) => {
              console.log('Login successful:', response);
              if (response['success'] == true) {
                alert('Login successful:');
                this.relog.userdetails.id.set(response['user']['id']);
                this.relog.userdetails.projects.set(
                  response['user']['projects']
                );
                this.relog.userdetails.username.set(
                  response['user']['username']
                );
                this.relog.userdetails.role.set(response['user']['role']);
                this.relog.userdetails.phoneno.set(
                  response['user']['phoneNumber']
                );
                this.relog.userdetails.firstname.set(response['user']['fname']);
                this.relog.userdetails.lastname.set(response['user']['lname']);
                this.relog.userdetails.address.set(response['user']['address']);
                this.relog.userdetails.status.set('Online');
                this.updateStatus('Online');
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
