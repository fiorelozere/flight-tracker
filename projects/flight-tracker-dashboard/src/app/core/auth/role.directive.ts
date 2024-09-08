import { Directive, effect, inject, input } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthStore } from './auth.store';
import { Role } from './role.enum';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[role]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class RoleDirective {
  role = input.required<Role>();
  authState = inject(AuthStore);
  ngIfRef = inject(NgIf);

  constructor() {
    effect(() => {
      this.ngIfRef.ngIf = this.role() === this.authState.tokenDecoded()?.role;
    });
  }
}
