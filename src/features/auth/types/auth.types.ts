export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  token?: string;
}
