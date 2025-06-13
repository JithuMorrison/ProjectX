import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Relog } from './relog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'LoginProject';

  relog = inject(Relog);
  http = inject(HttpClient);

  private storageKey = 'openTabs';

  ngOnInit() {
    this.incrementTabCount();
    window.addEventListener('storage', this.onStorageChange.bind(this));
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

  incrementTabCount() {
    const current = parseInt(localStorage.getItem(this.storageKey) || '0', 10);
    localStorage.setItem(this.storageKey, (current + 1).toString());
  }

  decrementTabCount() {
    const current = parseInt(localStorage.getItem(this.storageKey) || '0', 10);
    const newCount = Math.max(current - 1, 0);
    localStorage.setItem(this.storageKey, newCount.toString());
  }

  onStorageChange(event: StorageEvent) {
    if (event.key === this.storageKey && event.newValue === '0') {
      this.updateStatus('Offline');
    }
  }

  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    this.decrementTabCount();
  }
}
