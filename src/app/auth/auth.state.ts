import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from '../models/token-decoded.interface';
import { AuthService } from './auth.service';
import { AuthPayload } from '../models/auth-payload.interface';
import { createEffect } from 'ngxtension/create-effect';
import { catchError, concatMap, map, pipe, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  auth = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  tokenStorage = injectLocalStorage<string | null>('token', {
    storageSync: true
  });
  token = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.token());
  tokenDecoded = computed(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    return this.decodeToken(token);
  });

  init() {
    const token = this.tokenStorage();
    if(token) {
      this.setToken(token);
    }
  }

  setToken(token: string | null) {
    this.token.set(token);
  }

  public decodeToken(token: string): TokenDecoded | null {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  login = createEffect<AuthPayload>(
    pipe(
      concatMap(payload =>
        this.auth.login(payload).pipe(map(response => {
            this.setToken(response.token);
            this.tokenStorage.set(response.token);
            this.router.navigateByUrl('/dashboard');
            return response;
          }), catchError(err => {
            this.snackBar.open('Wrong credentials', 'Dismiss', { duration: 5000 });
            return throwError(() => err);
          })
        )
      ),
    ),
  );

  logout() {
    this.setToken(null);
    this.tokenStorage.set(null);
    this.router.navigateByUrl('/sign-in');
  }
}
