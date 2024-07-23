import { Ticket } from './ticket.interface';

export interface TicketListParams {
  page: number;
  pageSize: number;
  from_date: string | null;
  to_date: string | null;
  inbound: string | null;
  outbound: string | null;
  from_price: number | null;
  to_price: number | null;
}

export interface TicketListState {
  data: Ticket[];
  params: TicketListParams;
  total: number;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
