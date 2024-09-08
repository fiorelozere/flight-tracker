import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TicketListParams } from '../../../core/tickets/ticket-state.interface';

export interface TicketFiltersForm {
  from_date: string | null;
  to_date: string | null;
  from_price: number | null;
  to_price: number | null;
  inbound: string | null;
  outbound: string | null;
}

@Component({
  selector: 'app-ticket-filters',
  template: `
    <form [formGroup]="form">
      <div class="flex flex-wrap">
        <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
          <mat-label>Enter a date range</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input
              matStartDate
              formControlName="from_date"
              placeholder="Start date"
            />
            <input
              matEndDate
              formControlName="to_date"
              placeholder="End date"
            />
          </mat-date-range-input>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>

          @if (form.controls.from_date.hasError('matStartDateInvalid')) {
            <mat-error>Invalid start date</mat-error>
          }
          @if (form.controls.to_date.hasError('matEndDateInvalid')) {
            <mat-error>Invalid end date</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
          <mat-label>From price</mat-label>
          <input type="number" matInput formControlName="from_price" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
          <mat-label>To price</mat-label>
          <input type="number" matInput formControlName="to_price" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
          <mat-label>Inbound</mat-label>
          <input matInput formControlName="inbound" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="mx-2 my-4 w-full max-w-sm">
          <mat-label>Outbound</mat-label>
          <input matInput formControlName="outbound" />
        </mat-form-field>
      </div>
      <div class="flex items-center justify-end">
        <button
          mat-stroked-button
          color="secondary"
          class="mx-2"
          (click)="onReset()"
        >
          Clear
        </button>
        <button mat-flat-button class="mx-2" (click)="onSearch()">
          Search
        </button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [
    MatFormField,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatDatepicker,
    MatSuffix,
    MatStartDate,
    MatEndDate,
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatError,
    MatInput,
    JsonPipe,
    MatButton,
  ],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFiltersComponent {
  fb = inject(FormBuilder);
  params = input.required<Partial<TicketListParams>>();
  search = output<Partial<TicketListParams>>();

  form = this.fb.group<TicketFiltersForm>({
    from_date: '',
    to_date: '',
    from_price: null,
    to_price: null,
    inbound: '',
    outbound: '',
  });

  constructor() {
    effect(() => {
      this.form.patchValue(
        {
          ...this.params(),
          from_date: this.parseDate(this.params().from_date),
          to_date: this.parseDate(this.params().to_date),
          from_price: Number(this.params().from_price),
          to_price: Number(this.params().to_price),
        } as Partial<TicketListParams>,
        { emitEvent: false },
      );
    });
  }

  /**
   * Parses a date string into a Date object.
   * @param {string | null | undefined} dateString - The date string to parse.
   * @returns {Date | null} The parsed Date object or null if the input is invalid.
   */
  parseDate(dateString: string | null | undefined): Date | null {
    if (!dateString) return null;
    return new Date(dateString);
  }

  /**
   * Emits the search event with the current form values.
   */
  onSearch() {
    this.search.emit(this.form.value as Partial<TicketListParams>);
  }

  /**
   * Resets the form and emits the search event with the reset values.
   */
  onReset() {
    this.form.reset();
    this.search.emit(this.form.value as Partial<TicketListParams>);
  }
}
