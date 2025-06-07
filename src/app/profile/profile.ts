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
        'http://localhost:3000/updateUser/' + this.relog.userdetails.id(),
        this.relog.userdetails
      )
      .subscribe((response) => {
        alert(response);
      });
    this.toggleEdit();
  }

  goback() {
    this.router.navigate(['/dash'], {
      queryParams: { name: this.relog.userdetails.email() },
    });
  }
}
