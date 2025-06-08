import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Projects } from '../projects';
import { Relog } from '../relog';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private route: ActivatedRoute) {}

  private http = inject(HttpClient);
  public projects = inject(Projects);
  relog = inject(Relog);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.name = params['name'];
    });
    this.http.get<any[]>('http://localhost:8080/hello').subscribe((data) => {
      console.log(data);
      const transformed = data.map((item) => ({
        id: item['id'],
        name: item['name'],
        description: item['description'],
        status: item['status'],
        color: Math.floor(Math.random() * 4) + 1,
      }));
      this.projects.projects.set([...this.projects.projects(), ...transformed]);
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
}
