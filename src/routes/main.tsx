import { BookingPage, DashboardPage } from "@/features";

export const mainRoutes = [
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/bookings",
    element: <BookingPage />,
  },
];
