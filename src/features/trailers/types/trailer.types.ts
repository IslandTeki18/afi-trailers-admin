export type Trailer = {
  _id?: string;
  name: string;
  capacity: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  type: string;
  rentalPrices: {
    halfDay?: number;
    fullDay: number;
  };
  deliveryFee: number;
  weekendSurcharge?: number;
  maintenanceStatus: "Operational" | "Maintenance" | "Out of Service";
  lastMaintenanceDate: Date | null;
  nextScheduledMaintenance?: Date | null;
  bookedDates: TrailerBookedDates[];
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  photos?: string[];
  features: string[];
  usageHistory: TrailerUsageHistory[];
  insuranceRequired: boolean;
  towingRequirements: string[];
  serviceTypes: ("full" | "self")[];
  weight: {
    empty: number;
    maxLoad: number;
  };
  availability: {
    isAvailable: boolean;
    nextAvailableDate?: Date;
  };
  ratings: {
    averageRating: number;
    totalReviews: number;
  };
};

export type TrailerBookedDates = {
  startDate: Date;
  endDate: Date;
  customerId: string;
  bookingId: string;
  timeStamp: Date;
  serviceType: "full" | "self";
  status: "confirmed" | "pending" | "cancelled";
};

export type TrailerUsageHistory = {
  _id: string;
  customerId: string;
  rentalPeriod: { start: Date; end: Date };
  totalPaid: number;
  serviceType: "full" | "self";
  feedback?: {
    rating: number;
    comment?: string;
  };
  incidentReport?: {
    description: string;
    dateReported: Date;
    resolved: boolean;
  };
};
