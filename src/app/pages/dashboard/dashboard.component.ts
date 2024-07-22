import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  template: `dashboard`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {
}
