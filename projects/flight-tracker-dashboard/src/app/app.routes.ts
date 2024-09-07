import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./feature/sign-in/sign-in.routes'),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    canMatch: [authGuard()],
    children: [
      {
        path: '',
        loadChildren: () => import('./feature/dashboard/dashboard.routes'),
      },
      {
        path: 'tickets',
        loadChildren: () => import('./feature/tickets/tickets.routes'),
      },
    ],
  },
];
