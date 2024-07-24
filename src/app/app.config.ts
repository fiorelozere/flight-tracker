import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from './auth/auth.store';
import { authInterceptor } from './auth/auth.interceptor';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";

export function initializeApp(auth: AuthStore) {
  return () => auth.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthStore],
    },
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    MatSnackBar,
  ]
};
