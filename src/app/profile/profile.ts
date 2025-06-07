import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Relog } from '../relog';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  editMode: boolean = false;

  relog = inject(Relog);

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  save() {
    alert('Profile saved successfully!');
  }
}
