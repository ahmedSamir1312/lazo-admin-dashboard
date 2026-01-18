import { Routes } from '@angular/router';
import { DashboardComponent } from './Layout/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: 'Login',
    loadComponent: () =>
      import('./Components/auth/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('../app/Layout/dashboard/dash.routes').then((c) => c.routes),
  },
];
