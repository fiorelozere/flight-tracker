import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `auth`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthComponent {
}
