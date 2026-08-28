export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "arrived"
  | "no_show"
  | "checked_out";

export type Reservation = {
  id: string;
  restaurant_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  note: string;
  status: ReservationStatus;
  created_at: string;
};
