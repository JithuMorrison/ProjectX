import { Injectable, Inject, PLATFORM_ID, effect, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Relog {
  private storageKey = 'userDetails';
  private isBrowser: boolean;

  public userdetails = {
    id: signal(''),
    email: signal(''),
    username: signal(''),
    firstname: signal(''),
    lastname: signal(''),
    phoneno: signal(''),
    address: signal(''),
    role: signal(''),
    status: signal(''),
    projects: signal<string[]>([]),
  };

  projects = signal<any>([]);

  currProject = {
    id: signal(''),
    name: signal(''),
    description: signal(''),
    status: signal('Started'),
    tasks: signal<any[]>([]),
    members: signal<any[]>([]),
  };

  currtask = signal({
    id: '',
    name: '',
    description: '',
    status: 'Started',
    projectId: '',
    color: 1,
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loadFromStorage();

      effect(() => {
        const data = {
          id: this.userdetails.id(),
          email: this.userdetails.email(),
          username: this.userdetails.username(),
          firstname: this.userdetails.firstname(),
          lastname: this.userdetails.lastname(),
          phoneno: this.userdetails.phoneno(),
          address: this.userdetails.address(),
          role: this.userdetails.role(),
          projects: this.userdetails.projects(),
          status: this.userdetails.status(),
          currProject: {
            id: this.currProject.id(),
            name: this.currProject.name(),
            description: this.currProject.description(),
            status: this.currProject.status(),
            tasks: this.currProject.tasks(),
            members: this.currProject.members(),
          },
          currtask: this.currtask(),
        };
        this.saveToStorage(data);
      });
    }
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.id) this.userdetails.id.set(data.id);
        if (data.email) this.userdetails.email.set(data.email);
        if (data.username) this.userdetails.username.set(data.username);
        if (data.firstname) this.userdetails.firstname.set(data.firstname);
        if (data.lastname) this.userdetails.lastname.set(data.lastname);
        if (data.role) this.userdetails.role.set(data.role);
        if (data.address) this.userdetails.address.set(data.address);
        if (data.phoneno) this.userdetails.phoneno.set(data.phoneno);
        if (data.projects) this.userdetails.projects.set(data.projects);
        if (data.status) this.userdetails.status.set(data.status);

        if (data.currProject) {
          this.currProject.id.set(data.currProject.id || '');
          this.currProject.name.set(data.currProject.name || '');
          this.currProject.description.set(data.currProject.description || '');
          this.currProject.status.set(data.currProject.status || 'Started');
          this.currProject.tasks.set(data.currProject.tasks || []);
          this.currProject.members.set(data.currProject.members || []);
        }

        if (data.currtask) {
          this.currtask.set({
            id: data.currtask.id || '',
            name: data.currtask.name || '',
            description: data.currtask.description || '',
            status: data.currtask.status || 'Started',
            projectId: data.currtask.projectId || '',
            color: data.currtask.color ?? 1,
          });
        }
      } catch {
        console.error('Failed to parse user details from storage');
      }
    }
  }

  private saveToStorage(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
