import { Component, effect, inject, Injector, input, OnInit, signal, viewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../services/dashboard.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { createEffect } from 'ngxtension/create-effect';
import { catchError, map, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { DashboardChartTypeEnum } from '../../../enums/dashboard-chart-type.enum';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard-chart',
  template: `
    <mat-card appearance="outlined" class="my-4 mx-2 w-full">
      <mat-card-header>
        <mat-card-title>{{ label() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="h-10">
          @if (loading()) {
            <mat-progress-bar mode="query"></mat-progress-bar>
          }
        </div>
        <canvas
          [data]="data()"
          [options]="barChartOptions"
          [type]="barChartType"
          baseChart>
        </canvas>
        @if (error()) {
          <p class="m-4">{{ error() }}</p>
          <button mat-flat-button (click)="this.load()">Retry</button>
        }
      </mat-card-content>
    </mat-card>

  `,
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatProgressBar
  ],
  standalone: true
})

export class DashboardChart implements OnInit {
  chart = viewChild(BaseChartDirective);
  dashboard = inject(DashboardService);
  injector = inject(Injector);

  loading = signal(false);
  error = signal<string | null>(null);
  data = signal<ChartData<'bar'>>({ labels: [], datasets: [] });

  label = input<string>('');
  type = input.required<DashboardChartTypeEnum>();

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  barChartType = 'bar' as const;

  /**
   * Loads the chart data based on the chart type.
   */
  load = createEffect<void>(pipe(
      switchMap(() => {
          this.loading.set(true);
          console.log('here');
          return this.getDataByType().pipe(
            tap((data) => {
              this.loading.set(false);
              this.error.set(null);
              this.data.set(data as ChartData<'bar'>);
            }),
            catchError((error) => {
              this.loading.set(false);
              this.error.set('Something went wrong. Please try again.');
              return of({});
            })
          )
        }
      ),
    ),
  )

  constructor() {
    effect(() => {
      const chart = this.chart();
      if (chart && this.data()) {
        chart.update();
      }
    }, {
      injector: this.injector
    });
  }

  ngOnInit() {
    this.load();
  }

  /**
   * Fetches the data based on the type of chart.
   * @returns {Observable<ChartData<'bar'>>} An observable containing the chart data.
   */
  getDataByType(): Observable<ChartData<'bar'>> {
    switch (this.type()) {
      case DashboardChartTypeEnum.AVERAGE_PRICE:
        console.log('average price');
        return this.dashboard.getAveragePriceByTicketType().pipe(
          map((data) => ({
              labels: Object.keys(data),
              datasets: [
                { data: Object.keys(data).map((key) => data[key]), label: this.label() },
              ],
            }) as ChartData<'bar'>,
          ))
      case DashboardChartTypeEnum.TICKET_SALES:
        console.log('ticket sales');
        return this.dashboard.getTicketSalesOverTime().pipe(
          map((data) => ({
              labels: Object.keys(data),
              datasets: [
                { data: Object.keys(data).map((key) => data[key]), label: this.label() },
              ],
            }) as ChartData<'bar'>,
          ))
      default:
        return of({
          labels: [],
          datasets: [],
        })
    }
  }


}
