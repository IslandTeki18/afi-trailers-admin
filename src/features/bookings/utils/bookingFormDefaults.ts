import { SelectOption } from "@/components/Select";

export const serviceTypeOptions: SelectOption[] = [
  { value: "self", label: "Self Service (Customer Pickup)" },
  { value: "full", label: "Full Service (Delivery)" },
];

export const statusOptions: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export const depositOptions: SelectOption[] = [
  { value: "0", label: "0% (No Deposit)" },
  { value: "25", label: "25%" },
  { value: "50", label: "50%" },
  { value: "100", label: "100% (Full Payment)" },
];
