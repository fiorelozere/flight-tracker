import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TicketListParams } from '../models/ticket-state.interface';
import { Ticket } from '../models/ticket.interface';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  http = inject(HttpClient);

  getTickets(params: TicketListParams) {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.get<Ticket[]>(path, { observe: 'response', params: this.getParams(params) });
  }

  private getParams(params: TicketListParams): HttpParams {
    let httpParams = new HttpParams()
      .set('_page', params.page.toString())
      .set('_limit', params.pageSize.toString());

    if (params.from_date) {
      httpParams = httpParams.set('from_date_gte', new Date(params.from_date).toLocaleDateString());
    }
    if (params.to_date) {
      httpParams = httpParams.set('to_date_lte', new Date(params.to_date).toLocaleDateString());
    }
    if (params.inbound) {
      httpParams = httpParams.set('inbound_like', params.inbound);
    }
    if (params.outbound) {
      httpParams = httpParams.set('outbound_like', params.outbound);
    }
    if (params.from_price !== null && params.from_price !== undefined) {
      httpParams = httpParams.set('price_gte', params.from_price.toString());
    }
    if (params.to_price !== null && params.to_price !== undefined) {
      httpParams = httpParams.set('price_lte', params.to_price.toString());
    }

    return httpParams;
  }
}

