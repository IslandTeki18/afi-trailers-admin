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
import { Navbar } from "@/components/Navbar";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  TruckIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

// Layout component that incorporates Sidenav and Navbar
const Layout = () => {
  const location = useLocation();

  // Navigation items with icons for Sidenav
  const sideNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: location.pathname === "/",
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: BookOpenIcon,
      current: location.pathname === "/bookings",
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UserGroupIcon,
      current: location.pathname === "/customers",
    },
    {
      name: "Trailers",
      href: "/trailers",
      icon: TruckIcon,
      current: location.pathname === "/trailers",
    },
    {
      name: "Agreements",
      href: "/agreements",
      icon: DocumentTextIcon,
      current: location.pathname === "/agreements",
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCardIcon,
      current: location.pathname === "/payments",
    },
  ];

  // Teams for Sidenav
  const teams = [
    { name: "Admin Team", href: "#", initial: "A", current: false },
    { name: "Support Team", href: "#", initial: "S", current: false },
  ];

  // Navigation items for Navbar
  const navItems = [
    { name: "Dashboard", to: "/", current: location.pathname === "/" },
    {
      name: "Bookings",
      to: "/bookings",
      current: location.pathname === "/bookings",
    },
    {
      name: "Customers",
      to: "/customers",
      current: location.pathname === "/customers",
    },
    {
      name: "Trailers",
      to: "/trailers",
      current: location.pathname === "/trailers",
    },
    {
      name: "Agreements",
      to: "/agreements",
      current: location.pathname === "/agreements",
    },
    {
      name: "Payments",
      to: "/payments",
      current: location.pathname === "/payments",
    },
  ];

  // User navigation for Navbar
  const userNavigation = [
    { name: "Your Profile", to: "/profile" },
    { name: "Settings", to: "/settings" },
    { name: "Sign out", to: "/signout" },
  ];

  // Mock user data
  const user = {
    name: "Admin User",
    email: "admin@afitrailers.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  return (
    <div className="flex h-screen">
      {/* Sidenav takes up the left portion */}
      <div className="hidden lg:block lg:w-64">
        <Sidenav navigation={sideNavItems} teams={teams} variant="primary" />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Navbar at the top */}
        <Navbar
          navigation={navItems}
          userNavigation={userNavigation}
          user={user}
          logo="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          variant="primary"
        />

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        index: true,
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
    ],
  },
];
