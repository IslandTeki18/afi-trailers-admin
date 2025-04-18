import {
  BookingPage,
  DashboardPage,
  CustomersPage,
  TrailersPage,
  AgreementsPage,
} from "@/features";

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
  },
  {
    path: "/trailers",
    element: <TrailersPage />,
  },
  {
    path: "/agreements",
    element: <AgreementsPage />,
  }
];
