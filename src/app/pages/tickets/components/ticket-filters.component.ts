import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-filters',
  template: `filters`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketFiltersComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
