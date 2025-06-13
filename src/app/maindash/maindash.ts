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

  editMode = signal(false);
  searchTerm: string = '';

  ngOnInit() {
    if (this.relog.projects().length == 0) {
      const ids = this.relog.userdetails.projects().join(',');
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
    this.router.navigate(['/' + val], {
      queryParams: { name: this.relog.userdetails.username() },
    });
  }

  openProfile() {
    this.router.navigate(['/profile'], {
      queryParams: { name: this.relog.userdetails.username() },
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
          this.relog.projects.set([]);
          const ids = this.relog.userdetails.projects().join(',');
          this.http
            .get<any[]>(`http://localhost:8080/getProject?id=${ids}`)
            .subscribe((data) => {
              this.relog.projects.set(data);
            });
          this.addclick.set(false);
          alert('Project added successfully!');
        },
        (error) => {
          alert('Failed to add project. Please try again.');
        }
      );
  }

  onProject(project: any) {
    this.relog.currProject.id.set(project.id);
    this.relog.currProject.name.set(project.name);
    this.relog.currProject.description.set(project.description);
    this.relog.currProject.tasks.set(project.tasks);
    this.relog.currProject.members.set(project.members);
    this.router.navigate(['/projects'], {
      queryParams: { name: this.relog.userdetails.username() },
    });
  }

  edit(project: any) {
    this.editMode.set(!this.editMode());
    if (this.editMode()) {
      this.relog.currProject.name.set(project.name);
      this.relog.currProject.description.set(project.description);
      this.relog.currProject.id.set(project.id);
      this.relog.currProject.status.set(project.status);
      this.relog.currProject.tasks.set(project.tasks);
      this.relog.currProject.members.set(project.members);
    } else {
      this.relog.currProject.name.set('');
      this.relog.currProject.description.set('');
      this.relog.currProject.id.set('');
      this.relog.currProject.status.set('');
      this.relog.currProject.tasks.set([]);
      this.relog.currProject.members.set([]);
    }
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

  editProject() {
    this.http
      .put('http://localhost:8080/updateProject', {
        name: this.relog.currProject.name(),
        description: this.relog.currProject.description(),
        id: this.relog.currProject.id(),
        status: this.relog.currProject.status(),
        tasks: this.relog.currProject.tasks(),
        members: this.relog.currProject.members(),
      })
      .subscribe(
        (response) => {
          console.log('Project updated successfully:', response);
          this.editMode.set(false);
          alert('Project updated successfully!');
        },
        (error) => {
          console.error('Error updating project:', error);
          alert('Failed to update project. Please try again.');
        }
      );
  }

  deleteProject(project: any) {
    this.http
      .delete<any>(`http://localhost:8080/deleteProject/${project.id}`, {
        responseType: 'text' as 'json',
      })
      .subscribe(
        (response) => {
          this.relog.projects.update((projects) =>
            projects.filter((p: any) => p.id !== project.id)
          );
          this.relog.userdetails.projects.update((ids: string[]) =>
            ids.filter((id) => id !== project.id)
          );
          alert('Project deleted successfully!');
        },
        (error) => {
          alert('Failed to delete project. Please try again.');
        }
      );
  }

  logout() {
    this.router.navigate(['/']);
    this.updateStatus('Offline');
  }

  get filteredProj() {
    if (!this.searchTerm) return this.relog.projects();
    const term = this.searchTerm.toLowerCase();
    return this.relog
      .projects()
      .filter(
        (task: any) =>
          task.name.toLowerCase().includes(term) ||
          task.status.toLowerCase().includes(term)
      );
  }
}
