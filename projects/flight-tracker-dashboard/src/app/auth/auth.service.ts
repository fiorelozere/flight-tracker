import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthPayload } from '../models/auth-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  /**
   * Logs in the user with the provided credentials.
   * @param {AuthPayload} payload - The authentication payload containing username and password.
   * @returns {Observable<{ token: string }>} An observable containing the authentication token.
   */
  login(payload: AuthPayload): Observable<{ token: string }> {
    const path = `${ environment.apiUrl }/login`
    return this.http.post<{ token: string }>(path, payload);
  }
}
