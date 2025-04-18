export interface Trailer {
  id: string;
  name: string;
  description?: string;
  weightLimit: number;
  rentalRate: number;
  availability: "available" | "in_use" | "out_of_service";
  images?: string[];
  gpsLink?: string;
  createdAt: string;
}
