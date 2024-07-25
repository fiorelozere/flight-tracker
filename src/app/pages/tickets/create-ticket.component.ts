import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RoleDirective } from '../../auth/role.directive';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { TicketsService } from '../../services/tickets.service';
import { createEffect } from 'ngxtension/create-effect';
import { catchError, pipe, switchMap, tap, throwError } from 'rxjs';
import { Ticket } from '../../models/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dateRangeValidator } from '../../utils/validators/date-range-validator';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  template: `
    <div class="flex items-center space-between">
      <h3>Create Ticket</h3>
      <div>
        <button mat-stroked-button [routerLink]="['/dashboard/tickets']" class="mx-2">Cancel</button>
        <button mat-flat-button class="mx-2" [disabled]="form.invalid" (click)="onSave()">Save</button>
      </div>
    </div>
    <mat-card appearance="outlined">
      <form [formGroup]="form">
        <mat-card-content>
          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>Inbound</mat-label>
            <input matInput formControlName="inbound">
            @if (form.get('inbound')?.hasError('required')) {
              <mat-error>
                Inbound city is required
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>Outbound</mat-label>
            <input matInput formControlName="outbound">
            @if (form.get('outbound')?.hasError('required')) {
              <mat-error>
                Outbound city is required
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>Ticket Type</mat-label>
            <mat-select formControlName="ticket_type">
              @for (type of ticketTypes(); track $index) {
                <mat-option [value]="type">{{ type }}</mat-option>
              }
            </mat-select>
            @if (form.get('ticket_type')?.hasError('required')) {
              <mat-error>
                Ticket type is required
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price">
            @if (form.get('price')?.hasError('required')) {
              <mat-error>
                Price is required
              </mat-error>
            }
            @if (form.get('price')?.hasError('min')) {
              <mat-error>
                Price must be greater than 0
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>From Date</mat-label>
            <input matInput [matDatepicker]="fromDatePicker" formControlName="from_date">
            <mat-datepicker-toggle matSuffix [for]="fromDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #fromDatePicker></mat-datepicker>
            @if (form.get('from_date')?.hasError('required')) {
              <mat-error>
                From date is required
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>To Date</mat-label>
            <input matInput [matDatepicker]="toDatePicker" formControlName="to_date">
            <mat-datepicker-toggle matSuffix [for]="toDatePicker"></mat-datepicker-toggle>
            <mat-datepicker #toDatePicker></mat-datepicker>
            @if (form.get('to_date')?.hasError('required')) {
              <mat-error>
                To date is required
              </mat-error>
            }
          </mat-form-field>
          @if (form.hasError('dateRangeInvalid')) {
            <mat-error>
              From date must be earlier than to date.
            </mat-error>
          }
          <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
            <mat-label>Seat Number</mat-label>
            <input matInput formControlName="seat_number">
            @if (form.get('seat_number')?.hasError('required')) {
              <mat-error>
                Seat number is required
              </mat-error>
            }
          </mat-form-field>
        </mat-card-content>
      </form>
    </mat-card>
  `,
  standalone: true,
  imports: [
    MatButton,
    RoleDirective,
    RouterLink,
    MatCard,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatError,
    MatLabel,
    MatSuffix,
    JsonPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateTicketComponent {
  fb = inject(FormBuilder);
  tickets = inject(TicketsService);
  snackBar = inject(MatSnackBar);

  loading = signal(false);
  ticketTypes = signal([ 'Economy', 'Business', 'First Class' ]);

  form = this.fb.group({
    inbound: [ '', Validators.required ],
    outbound: [ '', Validators.required ],
    ticket_type: [ '', Validators.required ],
    price: [ 0, [ Validators.required, Validators.min(1) ] ],
    from_date: [ '', Validators.required ],
    to_date: [ '', Validators.required ],
    seat_number: [ '', Validators.required ]
  }, { validators: dateRangeValidator() });

  /**
   * Saves the new ticket if the form is valid.
   */
  onSave() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return;
    }
    this.createTicket({
      ...this.form.value,
      from_date: this.form.value.from_date ? new Date(this.form.value.from_date).toLocaleDateString() : null,
      to_date: this.form.value.to_date ? new Date(this.form.value.to_date).toLocaleDateString() : null,
    } as Ticket);
  }

  /**
   * Creates a new ticket using the TicketsService.
   */
  createTicket = createEffect<Ticket>(pipe(
      tap(() => this.loading.set(true)),
      switchMap((ticket: Ticket) =>
        this.tickets.createTicket(ticket).pipe(
          tap((response) => {
            this.form.reset();
            this.loading.set(false);
            this.snackBar.open('Ticket created successfully', 'Close');
          }),
          catchError((e) => {
              console.log(e);
              this.loading.set(false);
              this.snackBar.open(e.error.error ?? 'Something went wrong', 'Close');
              return throwError(() => e);
            }
          )
        ),
      )
    )
  )
}
