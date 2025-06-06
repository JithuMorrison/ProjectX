import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Maindash } from './maindash/maindash';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'projects', component: Dashboard },
  { path: 'dash', component: Maindash },
];
