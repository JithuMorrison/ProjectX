import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Projects {
  constructor() {}

  public projects = signal<any[]>([]);
}
