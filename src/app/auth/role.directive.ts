import { Directive, effect, inject, input } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthState } from './auth.state';
import { Role } from '../enums/role.enum';

@Directive({
  selector: '[role]',
  standalone: true,
  hostDirectives: [ NgIf ],
})
export class RoleDirective {
  role = input.required<Role>();
  authState = inject(AuthState);
  ngIf = inject(NgIf)

  constructor() {
    effect(() => {
      this.ngIf.ngIf = this.role() === this.authState.tokenDecoded()?.role;
    });
  }

}
