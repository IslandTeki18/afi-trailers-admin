import { Outlet, useLocation } from "react-router";
import {
  BookingPage,
  DashboardPage,
  CustomersPage,
  TrailersPage,
  AgreementsPage,
  PaymentPage,
} from "@/features";
import { Sidenav } from "@/components/Sidenav";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  TruckIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { LoginPage, ProtectedRoute, RoleGuard } from "@/features/auth";

// Layout component that incorporates Sidenav and Navbar
const MainLayout = () => {
  const location = useLocation();
  const { user } = useAuthContext();

  // Navigation items with icons for Sidenav
  const sideNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: location.pathname === "/",
      roles: ["admin", "staff"],
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: BookOpenIcon,
      current: location.pathname === "/bookings",
      roles: ["admin", "staff"],
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UserGroupIcon,
      current: location.pathname === "/customers",
      roles: ["admin", "staff"],
    },
    {
      name: "Trailers",
      href: "/trailers",
      icon: TruckIcon,
      current: location.pathname === "/trailers",
      roles: ["admin", "staff"],
    },
    {
      name: "Agreements",
      href: "/agreements",
      icon: DocumentTextIcon,
      current: location.pathname === "/agreements",
      roles: ["admin", "staff"],
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCardIcon,
      current: location.pathname === "/payments",
      roles: ["admin"],
    },
    {
      name: "Reports",
      href: "/reports",
      icon: DocumentTextIcon,
      current: location.pathname === "/reports",
      roles: ["admin"],
    },
  ];

  // Filter navigation items based on user role
  const roleBasedNavigation = sideNavItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  // Teams for Sidenav
  const teams = [
    { name: "Admin Team", href: "#", initial: "A", current: false },
    { name: "Support Team", href: "#", initial: "S", current: false },
  ];

  return (
    <div className="lg:block lg:w-64">
      <Sidenav navigation={roleBasedNavigation} teams={teams} variant="primary">
        <Outlet />
      </Sidenav>
    </div>
  );
};

export const mainRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        index: true,
        element: (
          <RoleGuard
            allowedRoles={["admin", "staff"]}
            element={<DashboardPage />}
          />
        ),
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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];
