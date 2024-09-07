import { Routes } from '@angular/router';
import { nonAuthGuard } from '../../core/auth/non-auth.guard';

export default [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./sign-in/sign-in.component'),
        canMatch: [nonAuthGuard()],
      },
    ],
  },
] as Routes;
