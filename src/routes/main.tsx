import { BookingPage, DashboardPage, CustomersPage } from "@/features";

export const mainRoutes = [
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/bookings",
    element: <BookingPage />,
  },
  {
    path: "/customers",
    element: <CustomersPage />,
  }
];
