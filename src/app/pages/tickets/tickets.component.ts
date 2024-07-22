import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  template: `tickets`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketsComponent {
}
