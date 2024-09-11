import { Routes } from '@angular/router';
import { DashboardService } from './dashboard/dashboard.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export default [
  {
    path: '',
    providers: [
      DashboardService,
      provideCharts(withDefaultRegisterables())
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component'),
      },
    ],
  },
] as Routes;
