import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthStore } from './auth.store';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  const clonedRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;

  return next(clonedRequest).pipe(
    catchError((err) => handleRequestError(err, authStore)),
  );
};

export function handleRequestError(
  err: HttpErrorResponse,
  authStore: AuthStore,
) {
  if (err.status === 401) {
    authStore.logout();
  }
  return throwError(() => err);
}
