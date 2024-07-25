import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { Ticket } from '../../../models/ticket.interface';

@Component({
  selector: 'app-ticket-card',
  template: `
    <mat-card class="flight-ticket-card">
      <mat-card-header>
        <mat-card-title>{{ ticket().inbound }} to {{ ticket().outbound }}</mat-card-title>
        <mat-card-subtitle>{{ ticket().ticket_type }} - Seat: {{ ticket().seat_number }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p><strong>Departure:</strong> {{ ticket().from_date }}</p>
        <p><strong>Return:</strong> {{ ticket().to_date }}</p>
        <p><strong>Price:</strong> $ {{ ticket().price }}</p>
      </mat-card-content>
      <mat-card-footer>
        <p>Ticket ID: {{ ticket().ticket_type_id }}</p>
      </mat-card-footer>
    </mat-card>
  `,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    DatePipe,
    MatCardFooter,
    MatCardSubtitle,
    MatCardTitle
  ],
  styles: [
    `
      .flight-ticket-card {
        margin: 16px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      mat-card-header {
        background-color: #d7e3ff;
        color: #005cbb;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
      }

      mat-card-title {
        font-weight: bold;
        font-size: 1.5em;
      }

      mat-card-subtitle {
        font-size: 1.2em;
        color: #757575;
      }

      mat-card-content p {
        margin: 8px 0;
      }

      mat-card-footer {
        padding: 16px;
        color: #005cbb;
        background-color: #d7e3ff;
        border-top: 1px solid #e0e0e0;
        text-align: right;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketCardComponent {
  ticket = input.required<Ticket>()
}
