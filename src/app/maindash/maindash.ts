import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Relog } from '../relog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maindash',
  imports: [CommonModule, FormsModule],
  templateUrl: './maindash.html',
  styleUrl: './maindash.css',
})
export class Maindash {
  constructor(private router: Router) {}

  ngOnInit() {
    if (this.relog.projects().length == 0) {
      const ids = this.relog.userdetails.projects().slice(0, 3).join(',');
      this.http
        .get<any[]>(`http://localhost:8080/getProject?id=${ids}`)
        .subscribe((data) => {
          this.relog.projects.set([...this.relog.projects(), ...data]);
        });
    }
  }

  relog = inject(Relog);
  http = inject(HttpClient);

  addclick = signal(false);

  openProject(val: string) {
    this.router.navigate(['/' + val], { queryParams: { name: 'Jithu' } });
  }

  openProfile() {
    this.router.navigate(['/profile'], {
      queryParams: { email: 'jithus2004@gmail.com' },
    });
  }

  toggleClick() {
    this.addclick.set(!this.addclick());
  }

  addProject() {
    this.http
      .post(
        'http://localhost:8080/addProject',
        {
          name: this.relog.currProject.name(),
          description: this.relog.currProject.description(),
          userid: this.relog.userdetails.id(),
        },
        {
          responseType: 'text',
        }
      )
      .subscribe(
        (response) => {
          console.log({
            name: this.relog.currProject.name(),
            description: this.relog.currProject.description(),
            userid: this.relog.userdetails.id(),
          });
          this.relog.userdetails.projects.update((projects) => [
            ...projects,
            response,
          ]);
          this.addclick.set(false);
          alert('Project added successfully!');
        },
        (error) => {
          alert('Failed to add project. Please try again.');
        }
      );
  }

  onProject(project: any) {
    this.router.navigate(['/projects'], {
      queryParams: { name: 'Jithu' },
    });
  }
}
