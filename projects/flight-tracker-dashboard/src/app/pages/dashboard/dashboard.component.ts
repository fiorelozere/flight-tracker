import { ChangeDetectionStrategy, Component, effect, ElementRef, viewChild } from '@angular/core';
import { DashboardChart } from './components/dashboard-chart.component';
import { DashboardChartTypeEnum } from '../../enums/dashboard-chart-type.enum';
import { TicketDealsComponent } from './components/ticket-deals.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="flex items-center space-between">
      <h3>Dashboard</h3>
    </div>
    <div class="flex flex-wrap w-full space-between">
      <app-dashboard-chart label="Average Price By Ticket Type" [type]="DashboardChartTypeEnum.AVERAGE_PRICE"
                           class="max-w-lg w-full"></app-dashboard-chart>
      <app-dashboard-chart label="Ticket Sales Over Time" [type]="DashboardChartTypeEnum.TICKET_SALES"
                           class="max-w-lg w-full"></app-dashboard-chart>
    </div>
    <div class="w-full">
      <app-ticket-deals></app-ticket-deals>
    </div>
  `,
  standalone: true,
  imports: [
    DashboardChart,
    TicketDealsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DashboardComponent {
  protected readonly DashboardChartTypeEnum = DashboardChartTypeEnum;
}
