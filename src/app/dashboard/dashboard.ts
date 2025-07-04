import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Projects } from '../projects';
import { Relog } from '../relog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private route: ActivatedRoute, private router: Router) {}

  private http = inject(HttpClient);
  public projects = inject(Projects);
  relog = inject(Relog);

  searchTerm: string = '';
  statusdisp = signal(false);

  selectedUserId: string = '';
  selectedTaskId: string = '';

  members = signal<any[]>([]);
  onlineMembers = signal<any[]>([]);
  showDialog = false;

  getTooltip(): string {
    const extraUsers = this.onlineMembers()
      .slice(2)
      .map((u) => u.username);
    return extraUsers.join(', ');
  }

  assignTask(userId: string, taskId: string) {
    this.assignTaskToUser(userId, {
      taskId: taskId,
      projectId: this.relog.currProject.id(),
    }).subscribe((response) => {
      alert('Task assigned successfully');
    });
  }

  assignTaskToUser(
    userId: string,
    body: { taskId: string; projectId: string }
  ) {
    return this.http.put(`http://localhost:8080/assignTask/${userId}`, body);
  }

  getUsernameById(id: string): string {
    const memberList = this.members();
    const user = memberList.find((m) => m.id === id);
    return user ? user.username : 'Unknown';
  }

  get filteredTasks() {
    if (!this.searchTerm) return this.projects.projects();
    const term = this.searchTerm.toLowerCase();
    return this.projects
      .projects()
      .filter(
        (task: any) =>
          task.name.toLowerCase().includes(term) ||
          task.status.toLowerCase().includes(term)
      );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.name = params['name'];
    });
    this.http
      .get<any[]>(
        'http://localhost:8080/hello?ids=' +
          this.relog.currProject.tasks().join(',')
      )
      .subscribe((data) => {
        console.log(data);
        const transformed = data.map((item) => ({
          id: item['id'],
          name: item['name'],
          description: item['description'],
          status: item['status'],
          memberAssigned: item['memberAssigned'],
          projectId: item['projectId'],
          color: Math.floor(Math.random() * 4) + 1,
        }));
        this.projects.projects.set(transformed);
      });
    this.http
      .post<{ username: string; status: string }[]>(
        'http://localhost:8080/getUsernames',
        this.relog.currProject.members()
      )
      .subscribe((users) => {
        console.log(users);

        const transformed = users.map((user, index) => ({
          id: this.relog.currProject.members()[index],
          username: user.username,
          status: user.status,
          color: Math.floor(Math.random() * 4) + 1,
        }));

        this.members.set(transformed);
        this.onlineMembers.set(
          transformed.filter((member) => member.status === 'Online')
        );
      });
  }

  heros = [
    { name: 'Jithu', emotion: 'Online' },
    { name: 'Jithu', emotion: 'Offline' },
  ];

  edit = signal(false);

  tasks = signal([
    {
      name: 'Task1',
      description: 'haha',
      status: false,
      color: Math.floor(Math.random() * 4) + 1,
    },
  ]);

  currentText: string = '';
  selectedHero = { name: '', emotion: 'Online' };
  name = '';

  handleUpdate() {
    this.relog.currtask.set({
      ...this.relog.currtask(),
      color: Math.floor(Math.random() * 4) + 1,
    });
    this.http
      .post('http://localhost:8080/addTask', this.relog.currtask(), {
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          alert('Data posted successfully:');
          this.relog.currtask.set({ ...this.relog.currtask(), id: response });
          this.projects.projects.update((val) => [
            ...val,
            this.relog.currtask(),
          ]);
        },
        (error) => {
          alert('Error posting data:');
        }
      );
    this.relog.currtask.set({
      id: '',
      name: '',
      description: '',
      status: 'Started',
      projectId: this.relog.currProject.id(),
      color: 1,
    });
  }

  handleUpdateTask() {
    this.http
      .put(
        'http://localhost:8080/update/' + this.relog.currtask().id,
        this.relog.currtask()
      )
      .subscribe(
        (response) => {
          alert('Task updated successfully:');
        },
        (error) => {
          alert(error.message);
        }
      );
  }

  handleDelete(id: string) {
    this.http.delete('http://localhost:8080/delete/' + id).subscribe(
      (response) => {
        alert('Task deleted successfully:');
        this.projects.projects.update((val) =>
          val.filter((task) => task.id !== id)
        );
      },
      (error) => {
        alert(error.message);
      }
    );
  }

  handleClick(task: any) {
    this.relog.currtask.set(task);
    this.edit.set(true);
  }

  updateStatus(val: string) {
    this.relog.currtask.set({ ...this.relog.currtask(), status: val });
  }

  handleReset() {
    this.relog.currtask.set({
      id: '',
      name: '',
      description: '',
      status: 'Started',
      projectId: this.relog.currProject.id(),
      color: 1,
    });
    this.edit.set(false);
  }

  goback() {
    this.router.navigate(['/dash'], {
      queryParams: { name: this.relog.userdetails.username() },
    });
  }

  toggleStatus() {
    this.statusdisp.set(!this.statusdisp());
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
          this.statusdisp.set(false);
          alert('Project updated successfully!');
        },
        (error) => {
          console.error('Error updating project:', error);
          alert('Failed to update project. Please try again.');
        }
      );
  }
}
