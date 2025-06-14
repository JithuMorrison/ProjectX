import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Digipin {
  getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ lat: 13.0827, lon: 80.2707 });
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => resolve({ lat: 13.0827, lon: 80.2707 })
        );
      }
    });
  }
}
