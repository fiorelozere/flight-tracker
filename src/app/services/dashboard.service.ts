import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  http = inject(HttpClient);


  getTicketSalesOverTime() {
    const path = `${environment.apiUrl}/dashboard/ticket-sales-over-time`;
    return this.http.get<{[key: string]: string | number}>(path);
  }

  getAveragePriceByTicketType() {
    const path = `${environment.apiUrl}/dashboard/average-price-by-ticket-type`;
    return this.http.get<{[key: string]: string | number}>(path);
  }
}
