import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maindash',
  imports: [],
  templateUrl: './maindash.html',
  styleUrl: './maindash.css',
})
export class Maindash {
  constructor(private router: Router) {}

  openProject(val: string) {
    this.router.navigate(['/' + val], { queryParams: { name: 'Jithu' } });
  }

  openProfile() {
    this.router.navigate(['/profile'], {
      queryParams: { email: 'jithus2004@gmail.com' },
    });
  }
}
