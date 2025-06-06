import { Customer } from "@/features/customers/types/customer.types";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  _id?: string;
  customer: Customer;
  trailerId: string;
  trailerName: string;
  startDate: Date;
  serviceType: "full" | "self";
  hasTowingInsurance: boolean;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  endDate: Date;
  status: BookingStatus;
  specialRequests?: string;
  totalAmount: number;
  depositAmount: number;
}


export interface TimeBlock {
  _id?: string;
  title: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  trailerId?: string;
  trailerName?: string;
  affectsAllTrailers: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  color?: string;
  isActive: boolean;
}