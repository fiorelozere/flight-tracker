import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { Role } from '../../core/enums/role.enum';

export default [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./tickets/tickets.component'),
      },
      {
        path: 'create',
        loadComponent: () => import('./create-ticket/create-ticket.component'),
        canMatch: [authGuard(Role.Admin)],
      },
    ],
  },
] as Routes;
