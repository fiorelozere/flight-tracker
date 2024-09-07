import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardChartComponent } from './dashboard-chart.component';
import { DashboardChartTypeEnum } from '../../../core/enums/dashboard-chart-type.enum';
import { TicketDealsComponent } from './ticket-deals.component';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="h-4"></div>
    <div class="flex items-center justify-between">
      <h2>Dashboard</h2>
    </div>
    <div class="grid grid-cols-2 w-full gap-3">
      <app-dashboard-chart
        label="Average Price By Ticket Type"
        [type]="DashboardChartTypeEnum.AVERAGE_PRICE"
        class="w-full"
      ></app-dashboard-chart>
      <app-dashboard-chart
        label="Ticket Sales Over Time"
        [type]="DashboardChartTypeEnum.TICKET_SALES"
        class="w-full"
      ></app-dashboard-chart>
    </div>
    <div class="w-full">
      <app-ticket-deals></app-ticket-deals>
    </div>
  `,
  standalone: true,
  imports: [DashboardChartComponent, TicketDealsComponent, MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  protected readonly DashboardChartTypeEnum = DashboardChartTypeEnum;
}
