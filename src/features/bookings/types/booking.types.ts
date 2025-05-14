import { Customer } from "@/features/customers/types/customer.types";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  customer: Customer
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
