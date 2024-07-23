import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RoleDirective } from '../../auth/role.directive';
import { Role } from '../../enums/role.enum';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TicketFiltersComponent } from './components/ticket-filters.component';
import { TicketListComponent } from './components/ticket-list.component';
import { TicketListStore } from './tickets.store';
import { JsonPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { injectQueryParams } from 'ngxtension/inject-query-params';

@Component({
  selector: 'app-tickets',
  template: `
    <div class="flex items-center space-between">
      <h3>Tickets</h3>
      <button mat-flat-button *role="Role.Admin" [routerLink]="['create']">Create Ticket</button>
    </div>

    <mat-card appearance="outlined">
      <mat-card-content>
        <app-ticket-filters></app-ticket-filters>
      </mat-card-content>
    </mat-card>

    <mat-card class="my-4" appearance="outlined">
      <mat-card-content>
        <app-ticket-list
          [page]="store.params().page"
          [pageSize]="store.params().pageSize"
          [total]="store.total()"
          (pageChange)="onPagination($event)"
          [data]="store.data()"></app-ticket-list>
        <!--        <pre>{{store.state() | json}}</pre>-->
      </mat-card-content>
    </mat-card>
  `,
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    RoleDirective,
    MatCard,
    TicketFiltersComponent,
    MatCardContent,
    TicketListComponent,
    JsonPipe
  ],
  providers: [
    TicketListStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketsComponent {
  Role = Role;

  queryParams = injectQueryParams();
  router = inject(Router);
  store = inject(TicketListStore);

  constructor() {
    this.store.load( {
      page: Number(this.queryParams()['_page']) ?? 0,
      pageSize: Number(this.queryParams()['_limit']) ?? 10,
      from_date: this.queryParams()['from_date'],
      to_date: this.queryParams()['to_date'],
      inbound: this.queryParams()['inbound'],
      outbound: this.queryParams()['outbound'],
      from_price: this.queryParams()['from_price'],
      to_price: this.queryParams()['to_price'],
    })
  }

  onPagination(event: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        _page: event.pageIndex + 1,
        _limit: event.pageSize
      },
      queryParamsHandling: 'merge'
    });
    this.store.load({page: event.pageIndex, pageSize: event.pageSize});
  }
}
