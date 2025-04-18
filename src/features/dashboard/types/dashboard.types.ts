export interface DashboardStats {
  totalBookings: number;
  activeTrailers: number;
  totalRevenue: number;
  upcomingBookings: number;
}

export interface RevenueData {
  date: string;
  amount: number;
}
