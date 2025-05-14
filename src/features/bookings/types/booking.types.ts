export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  trailerId: string;
  trailerName: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  totalAmount: number;
  depositAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
