import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { DashboardLayoutService } from '../../core/dashboard-layout/dashboard-layout.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <button
          (click)="layout.toggleSideNav()"
          mat-icon-button
          aria-label="Example icon-button with menu icon"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <span>Flight Tracker</span>
      </div>
      <div>
        <button
          [matMenuTriggerFor]="menu"
          mat-icon-button
          aria-label="Example icon-button with menu icon"
        >
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <div mat-menu-item>
        <p>{{ authState.tokenDecoded()?.username }}</p>
        <p>{{ authState.tokenDecoded()?.role }}</p>
      </div>
      <button mat-menu-item (click)="logout()">
        <mat-icon
          aria-hidden="false"
          aria-label="Example home icon"
          fontIcon="logout"
        ></mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  standalone: true,
  imports: [
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatMenuTrigger,
    MatButton,
    MatMenu,
    RouterLink,
    MatMenuItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  layout = inject(DashboardLayoutService);
  authState = inject(AuthStore);

  logout() {
    this.authState.logout();
  }
}
