import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthState } from '../../auth/auth.state';
import { AuthPayload } from '../../models/auth-payload.interface';

@Component({
  selector: 'app-sign-in',
  template: `
    <div class="flex items-center justify-center flex-column h-full w-full">
      <h1>Welcome to Flight Tracker</h1>
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Sign in</mat-card-title>
          <mat-card-subtitle>Enter credentials to continue</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" class="flex-column flex my-4" (ngSubmit)="login()">
            <mat-form-field appearance="outline">
              <mat-label>Enter your username</mat-label>
              <input
                formControlName="username"
                matInput
                placeholder="johndoe"
                required
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Enter your password</mat-label>
              <input
                formControlName="password"
                matInput [type]="hide() ? 'password' : 'text'"/>
              <button
                mat-icon-button
                matSuffix
                (click)="clickEvent($event)"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hide()"
              >
                <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <button type="submit" [disabled]="form.invalid" mat-flat-button class="w-full">Sign in</button>
          </form>
        </mat-card-content>
        @if (errorMessage()) {
          <mat-error>{{ errorMessage() }}</mat-error>
        }
      </mat-card>
    </div>
  `,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIconButton,
    MatIcon,
    MatLabel,
    MatError,
    MatButton,
    ReactiveFormsModule,
    MatSuffix
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SignInComponent {
  fb = inject(FormBuilder);
  authState = inject(AuthState);

  hide = signal(true);
  errorMessage = signal<string | null>(null);
  form = this.fb.group({
    username: [ '', [ Validators.required ] ],
    password: [ '', [ Validators.required ] ]
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    if(this.form.invalid) {
      this.errorMessage.set('Please enter your username and password')
      return;
    } else {
      const payload = this.form.value as AuthPayload;
      this.authState.login(payload)
    }
  }
}
