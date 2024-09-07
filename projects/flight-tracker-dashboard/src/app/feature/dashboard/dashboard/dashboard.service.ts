import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  http = inject(HttpClient);

  /**
   * Gets ticket sales data over time.
   * @returns {Observable<{[key: string]: string | number}>} An observable containing ticket sales data over time.
   */
  getTicketSalesOverTime(): Observable<Record<string, string | number>> {
    const path = `${environment.apiUrl}/dashboard/ticket-sales-over-time`;
    return this.http.get<Record<string, string | number>>(path);
  }

  /**
   * Gets average ticket price by ticket type.
   * @returns {Observable<{[key: string]: string | number}>} An observable containing average ticket price by type.
   */
  getAveragePriceByTicketType(): Observable<Record<string, string | number>> {
    const path = `${environment.apiUrl}/dashboard/average-price-by-ticket-type`;
    return this.http.get<Record<string, string | number>>(path);
  }
}
