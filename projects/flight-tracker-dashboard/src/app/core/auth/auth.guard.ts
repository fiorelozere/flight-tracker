import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { CanMatchFn, Router } from '@angular/router';

export function authGuard(role: string | null = null): CanMatchFn {
  return () => {
    const authState = inject(AuthStore);
    const router = inject(Router);
    if (
      !authState.isAuthenticated() ||
      (role && authState.tokenDecoded()?.role !== role)
    ) {
      router.navigateByUrl('/sign-in');
      return false;
    }
    return true;
  };
}
