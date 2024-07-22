import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `dashboard`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {
}
