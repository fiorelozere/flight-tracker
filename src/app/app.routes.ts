import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { nonAuthGuard } from './auth/non-auth.guard';
import { Role } from './enums/role.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent),
    canMatch: [ nonAuthGuard() ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canMatch: [ authGuard() ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent),
          },
          {
            path: 'create',
            loadComponent: () => import('./pages/tickets/create-ticket.component').then(m => m.CreateTicketComponent),
            canMatch: [ authGuard(Role.Admin) ],
          }
        ]
      }
    ]
  },
];
