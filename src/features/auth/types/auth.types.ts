export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  role: "admin" | "staff";
  token?: string;
};