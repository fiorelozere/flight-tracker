import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthState } from './auth/auth.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
}
