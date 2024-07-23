import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../auth/role.directive';
import { Role } from '../../enums/role.enum';

@Component({
  selector: 'app-tickets',
  template: `
    <div class="flex items-center space-between">
      <h3>Tickets</h3>
      <button mat-flat-button *role="Role.Admin" [routerLink]="['create']">Create Ticket</button>
    </div>
  `,
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    RoleDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketsComponent {
  Role = Role
}
