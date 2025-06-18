import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Relog } from '../relog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Digipin } from '../digipin';
import { StatusPipe } from '../status-pipe';

@Component({
  selector: 'app-maindash',
  imports: [CommonModule, FormsModule, StatusPipe],
  templateUrl: './maindash.html',
  styleUrl: './maindash.css',
})
export class Maindash {
  constructor(private router: Router, private geo: Digipin) {}

  currentLocation?: { lat: number; lon: number };
  digipin = '';
  newdigi = '';
  decodedLocation?: { latitude: number; longitude: number };

  editMode = signal(false);
  searchTerm: string = '';

  latestproj = signal<any[]>([]);

  ngOnInit() {
    if (this.relog.projects().length == 0) {
      const ids = this.relog.userdetails.projects().join(',');
      this.http
        .get<any[]>(`http://localhost:8080/getProject?id=${ids}`)
        .subscribe((data) => {
          this.relog.projects.set([...this.relog.projects(), ...data]);
        });
    }
    this.getLocationAndEncode();
    this.latestproj = this.relog.projects;
  }

  relog = inject(Relog);
  http = inject(HttpClient);

  addclick = signal(true);
  joinproj = signal(false);
  joinid = signal('');

  togglejoin() {
    this.joinproj.set(!this.joinproj());
  }

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
    this.relog.currProject.status.set(project.status);
    this.relog.currProject.tasks.set(project.tasks);
    this.relog.currProject.members.set(project.members);

    const latestProjects = this.latestproj(); // get current value
    const index = latestProjects.findIndex((p: any) => p.id === project.id);

    if (index !== -1) {
      const [matchedProject] = latestProjects.splice(index, 1);
      latestProjects.unshift(matchedProject);
      this.latestproj.set([...latestProjects]);
    }

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

  joinProject() {
    const userId = this.relog.userdetails.id();

    const projectId = this.joinid();

    if (!userId || !projectId) return;

    const payload = {
      userid: userId,
      projectid: projectId,
    };

    this.http
      .post('http://localhost:8080/joinProject', payload, {
        responseType: 'text',
      })
      .subscribe({
        next: (res) => {
          alert('Join project success:');
          const ids = this.relog.userdetails.projects().join(',');
          this.http
            .get<any[]>(`http://localhost:8080/getProject?id=${ids}`)
            .subscribe((data) => {
              this.relog.projects.set([...this.relog.projects(), ...data]);
            });
        },
        error: (err) => console.error('Error joining project:', err),
      });
  }

  getLocationAndEncode() {
    this.geo.getCurrentLocation().then((loc) => {
      this.currentLocation = loc;
      console.log(this.currentLocation);
      this.http
        .post<{ digipin: string }>('http://localhost:8080/encode', loc)
        .subscribe((res) => (this.digipin = res.digipin));
    });
  }

  decodeDigiPin() {
    this.http
      .post<{ latitude: number; longitude: number }>(
        'http://localhost:8080/decode',
        { digipin: this.newdigi }
      )
      .subscribe((res) => (this.decodedLocation = res));
  }
}
