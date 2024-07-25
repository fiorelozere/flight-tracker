import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from '../models/token-decoded.interface';
import { AuthService } from './auth.service';
import { AuthPayload } from '../models/auth-payload.interface';
import { createEffect } from 'ngxtension/create-effect';
import { catchError, concatMap, map, pipe, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
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

  constructor() {
    explicitEffect([this.tokenStorage], ([token]) => {
      this.setToken(token ?? null);
      if(token) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/sign-in');
      }
    }, {
      defer: true
    });
  }


  /**
   * Initializes the store by setting the token from local storage if available.
   */
  init() {
    const token = this.tokenStorage();
    if (token) {
      this.setToken(token);
    }
  }

  /**
   * Sets the authentication token.
   * @param {string | null} token - The authentication token.
   */
  setToken(token: string | null) {
    this.token.set(token);
  }

  /**
   * Decodes the JWT token.
   * @param {string} token - The JWT token to decode.
   * @returns {TokenDecoded | null} The decoded token object or null if decoding fails.
   */
  public decodeToken(token: string): TokenDecoded | null {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  /**
   * Logs in the user with the provided credentials.
   * @param {AuthPayload} payload - The authentication payload containing username and password.
   * @returns {Observable<any>} An observable that completes when the login process is finished.
   */
  login = createEffect<AuthPayload>(
    pipe(
      concatMap(payload =>
        this.auth.login(payload).pipe(map(response => {
            this.setToken(response.token);
            this.tokenStorage.set(response.token);
            this.router.navigateByUrl('/dashboard');
            return response;
          }), catchError(err => {
            if(err.status === 401) {
              this.snackBar.open('Wrong credentials', 'Dismiss', { duration: 5000 });
            } else {
              this.snackBar.open('An error occurred', 'Dismiss', { duration: 5000 });
            }
            return throwError(() => err);
          })
        )
      ),
    ),
  );

  /**
   * Logs out the user by clearing the token and navigating to the sign-in page.
   */
  logout() {
    this.setToken(null);
    this.tokenStorage.set(null);
    this.router.navigateByUrl('/sign-in');
  }
}
