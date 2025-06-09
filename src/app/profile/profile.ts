import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Relog } from '../relog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(private router: Router) {}

  editMode: boolean = false;

  relog = inject(Relog);

  http = inject(HttpClient);

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  save() {
    this.http
      .put(
        'http://localhost:8080/updateUser/' + this.relog.userdetails.id(),
        {
          email: this.relog.userdetails.email(),
          username: this.relog.userdetails.username(),
          fname: this.relog.userdetails.lastname(),
          lname: this.relog.userdetails.firstname(),
          role: 'Offline',
          address: this.relog.userdetails.address(),
          phoneNumber: this.relog.userdetails.phoneno(),
          projects: this.relog.userdetails.projects(),
        },
        { responseType: 'text' }
      )
      .subscribe((response) => {
        alert('user updated successfully');
      });
    this.toggleEdit();
  }

  goback() {
    this.router.navigate(['/dash'], {
      queryParams: { name: this.relog.userdetails.email() },
    });
  }
}
