import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TicketListParams } from './ticket-state.interface';
import { Ticket } from './ticket.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  http = inject(HttpClient);

  /**
   * Fetches tickets based on the provided parameters.
   * @param {TicketListParams} params - The parameters for fetching tickets.
   * @returns {Observable<HttpResponse<Ticket[]>>} An observable containing the list of tickets.
   */
  getTickets(params: TicketListParams): Observable<HttpResponse<Ticket[]>> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.get<Ticket[]>(path, {
      observe: 'response',
      params: this.getParams(params),
    });
  }

  /**
   * Converts TicketListParams into HttpParams.
   * @param {TicketListParams} params - The parameters to convert.
   * @returns {HttpParams} The converted HttpParams object.
   */
  private getParams(params: TicketListParams): HttpParams {
    let httpParams = new HttpParams()
      .set('_page', params.page.toString())
      .set('_limit', params.pageSize.toString());

    if (params.from_date) {
      httpParams = httpParams.set(
        'from_date_gte',
        new Date(params.from_date).toLocaleDateString(),
      );
    }
    if (params.to_date) {
      httpParams = httpParams.set(
        'to_date_lte',
        new Date(params.to_date).toLocaleDateString(),
      );
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

  /**
   * Fetches ticket deals.
   * @returns {Observable<Ticket[]>} An observable containing the list of ticket deals.
   */
  getTicketDeals(): Observable<Ticket[]> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.get<Ticket[]>(path, {
      params: new HttpParams({
        fromObject: {
          _limit: '6',
          _sort: 'price',
          _order: 'asc',
        },
      }),
    });
  }

  /**
   * Creates a new ticket.
   * @param {Ticket} ticket - The ticket to create.
   * @returns {Observable<Ticket>} An observable containing the created ticket.
   */
  createTicket(ticket: Ticket): Observable<Ticket> {
    const path = `${environment.apiUrl}/tickets`;
    return this.http.post<Ticket>(path, ticket);
  }
}
