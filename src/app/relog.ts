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
    projects: signal([]),
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loadFromStorage();
      effect(() => {
        const data = {
          email: this.userdetails.email(),
          username: this.userdetails.username(),
          firstname: this.userdetails.firstname(),
          lastname: this.userdetails.lastname(),
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
        if (data.email) this.userdetails.email.set(data.email);
        if (data.username) this.userdetails.username.set(data.username);
        if (data.firstname) this.userdetails.firstname.set(data.firstname);
        if (data.lastname) this.userdetails.lastname.set(data.lastname);
      } catch {
        console.error('Failed to parse user details from storage');
      }
    }
  }

  private saveToStorage(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
