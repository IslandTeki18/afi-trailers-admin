export type BookingStatus =
  | "pending"
  | "signed"
  | "paid"
  | "active"
  | "completed"
  | "canceled";

export interface Booking {
  id: string;
  trailerId: string;
  customerId: string;
  serviceType: "full_service" | "self_service";
  startDate: string;
  endDate: string;
  status: BookingStatus;
  agreementUrl?: string;
  paymentStatus?: "unpaid" | "paid";
}
