import { Routes } from '@angular/router';
import { DashboardService } from './dashboard/dashboard.service';

export default [
  {
    path: '',
    providers: [DashboardService],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component'),
      },
    ],
  },
] as Routes;
