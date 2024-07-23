import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { CanMatchFn, Router } from '@angular/router';

export function nonAuthGuard(): CanMatchFn {
  return () => {
    const authState = inject(AuthStore);
    const router = inject(Router);
    if(authState.isAuthenticated()) {
      router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}
