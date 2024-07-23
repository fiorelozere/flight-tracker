import { inject } from '@angular/core';
import { AuthState } from './auth.state';
import { CanMatchFn, Router } from '@angular/router';

export function authGuard(role: string | null = null): CanMatchFn {
  return () => {
    const authState = inject(AuthState);
    const router = inject(Router);
    if(!authState.isAuthenticated() || (role && authState.tokenDecoded()?.role !== role)) {
      router.navigateByUrl('/sign-in');
      return false;
    }
    return true;
  }
}
