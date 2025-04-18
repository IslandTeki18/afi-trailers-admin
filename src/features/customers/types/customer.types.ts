export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  notes?: string;
  flagged?: boolean;
}
