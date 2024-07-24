import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { Ticket } from '../../../models/ticket.interface';
import { TicketCardComponent } from './ticket-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ticket-list',
  template: `
    @for (ticket of data(); track ticket.id) {
      <app-ticket-card [ticket]="ticket"></app-ticket-card>
    } @empty {
      <p class="m-4">No tickets found</p>
    }
    <mat-paginator [length]="total()"
                   [pageSize]="pageSize()"
                   [pageIndex]="page()"
                   [pageSizeOptions]="[5, 10, 25, 100]"
                   (page)="pageChange.emit($event)"
                   aria-label="Select page">
    </mat-paginator>
  `,
  standalone: true,
  imports: [
    TicketCardComponent,
    MatPaginator
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketListComponent {
  data = input.required<Ticket[]>();
  pageSize = input.required<number>();
  page = input.required<number>();
  total = input.required<number>();

  pageChange = output<PageEvent>()
}
