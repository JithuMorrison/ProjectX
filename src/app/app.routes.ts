import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'projects',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'dash',
    loadComponent: () => import('./maindash/maindash').then((m) => m.Maindash),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then((m) => m.Profile),
  },
  {
    path: 'forgot',
    loadComponent: () =>
      import('./forgotpass/forgotpass').then((m) => m.Forgotpass),
  },
];
