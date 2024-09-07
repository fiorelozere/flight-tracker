import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { TicketCardComponent } from '../../../pattern/ticket-card/ticket-card.component';
import { Ticket } from '../../../core/models/ticket.interface';
import { createEffect } from 'ngxtension/create-effect';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { TicketsService } from '../../../core/tickets/tickets.service';

@Component({
  selector: 'app-ticket-deals',
  template: `
    <mat-card appearance="outlined" class="my-4 mx-2 w-full">
      <mat-card-header>
        <mat-card-title>Deals</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="tickets-grid">
          @for (ticket of data(); track ticket.id) {
            <app-ticket-card [ticket]="ticket"></app-ticket-card>
          } @empty {
            <p class="m-4">No tickets found</p>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    TicketCardComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDealsComponent implements OnInit {
  data = signal<Ticket[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  tickets = inject(TicketsService);

  ngOnInit() {
    this.load();
  }

  /**
   * Loads the ticket deals.
   */
  load = createEffect<void>(
    pipe(
      switchMap(() => {
        this.loading.set(true);
        console.log('here');
        return this.tickets.getTicketDeals().pipe(
          tap((data) => {
            this.loading.set(false);
            this.error.set(null);
            this.data.set(data);
          }),
          catchError(() => {
            this.loading.set(false);
            this.error.set('Something went wrong. Please try again.');
            return of({});
          }),
        );
      }),
    ),
  );
}
