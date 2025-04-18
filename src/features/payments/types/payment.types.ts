export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  method: "stripe" | "cash" | "check" | "manual";
  status: "paid" | "pending" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
}
