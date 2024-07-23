import { inject } from '@angular/core';
import { AuthState } from './auth.state';
import { CanMatchFn, Router } from '@angular/router';

export function nonAuthGuard(): CanMatchFn {
  return () => {
    const authState = inject(AuthState);
    const router = inject(Router);
    if(authState.isAuthenticated()) {
      router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}
