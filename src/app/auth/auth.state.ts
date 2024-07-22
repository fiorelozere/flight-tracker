import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from '../models/token-decoded.interface';
import { AuthService } from './auth.service';
import { AuthPayload } from '../models/auth-payload.interface';
import { createEffect } from 'ngxtension/create-effect';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  auth = inject(AuthService);
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
    effect(() => {
      console.log(this.token(), this.tokenDecoded())
    })
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

  login(payload: AuthPayload) {
    return createEffect(() =>
      this.auth.login(payload).pipe(map(response => {
        this.setToken(response.token);
        return response;
      }))
    )
  }
}
