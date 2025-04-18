import {
  BookingPage,
  DashboardPage,
  CustomersPage,
  TrailersPage,
  AgreementsPage,
  PaymentPage,
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
  },
  {
    path: "/payments",
    element: <PaymentPage />,
  },
];
