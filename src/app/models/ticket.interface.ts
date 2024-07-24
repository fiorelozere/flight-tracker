export interface Ticket {
  id?: number;
  inbound: string;
  outbound: string;
  ticket_type: string;
  ticket_type_id: string;
  price: number;
  from_date: string;
  to_date: string;
  seat_number: string;
}
