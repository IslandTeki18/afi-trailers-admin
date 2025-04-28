import { useState } from "react";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";
import { Button } from "./Button";

type NavItem = {
  name: string;
  to: string;
  current: boolean;
};

type UserMenuLink = {
  name: string;
  to: string;
};

type User = {
  name: string;
  email: string;
  imageUrl: string;
};

type NavbarVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error"
  | "base";

type NavbarProps = {
  navigation: NavItem[];
  userNavigation?: UserMenuLink[];
  user?: User;
  logo?: string;
  variant?: NavbarVariant;
};

export const Navbar = ({
  navigation,
  userNavigation,
  user,
  logo = "https://placehold.co/600x400",
  variant = "base",
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const variantClasses = {
    primary: {
      nav: "bg-primary-500",
      text: "text-white",
      hover: "hover:bg-primary-700",
      current: "bg-primary-900",
      mobileMenu: "border-primary-300",
      userEmail: "text-primary-400",
    },
    secondary: {
      nav: "bg-secondary-500",
      text: "text-white",
      hover: "hover:bg-secondary-700",
      current: "bg-secondary-900",
      mobileMenu: "border-secondary-300",
      userEmail: "text-secondary-400",
    },
    accent: {
      nav: "bg-accent-500",
      text: "text-white",
      hover: "hover:bg-accent-700",
      current: "bg-accent-900",
      mobileMenu: "border-accent-300",
      userEmail: "text-accent-400",
    },
    success: {
      nav: "bg-success",
      text: "text-white",
      hover: "hover:bg-success/80",
      current: "bg-success-900",
      mobileMenu: "border-success-300",
      userEmail: "text-success-400",
    },
    warning: {
      nav: "bg-warning",
      text: "text-white",
      hover: "hover:bg-warning/80",
      current: "bg-warning-900",
      mobileMenu: "border-warning-300",
      userEmail: "text-warning-400",
    },
    info: {
      nav: "bg-info",
      text: "text-white",
      hover: "hover:bg-info/80",
      current: "bg-info-900",
      mobileMenu: "border-info-300",
      userEmail: "text-info-400",
    },
    error: {
      nav: "bg-error",
      text: "text-white",
      hover: "hover:bg-error/80",
      current: "bg-error-900",
      mobileMenu: "border-error-300",
      userEmail: "text-error-400",
    },
    base: {
      nav: "bg-base-500",
      text: "text-base-50",
      hover: "hover:bg-base-700",
      current: "bg-base-900",
      mobileMenu: "border-base-300",
      userEmail: "text-base-400",
    },
  };

  const currentVariant = variantClasses[variant];

  return (
    <nav className={currentVariant.nav}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <img className="h-8 w-auto" src={logo} alt="Company logo" />
            </div>
            <div className="hidden sm:ml-6 lg:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      item.current
                        ? `${currentVariant.current} text-white`
                        : `${currentVariant.text} ${currentVariant.hover} hover:text-white`
                    }`}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:block">
            <div className="flex items-center">
              <Button variant="link">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6 text-white" />
              </Button>

              <div className="relative ml-3">
                <div>
                  {user && (
                    <Button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      variant="link"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </Button>
                  )}
                </div>

                {userMenuOpen && userNavigation && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="-mr-2 flex sm:hidden">
            <Button
              type="button"
              variant="link"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="block h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  item.current
                    ? `${currentVariant.current} text-white`
                    : `${currentVariant.text} ${currentVariant.hover} hover:text-white`
                }`}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          {user && (
            <div className={`border-t ${currentVariant.mobileMenu} pb-3 pt-4`}>
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.name}
                  </div>
                  <div
                    className={`text-sm font-medium ${currentVariant.userEmail}`}
                  >
                    {user.email}
                  </div>
                </div>
                <Button type="button" variant="link">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </Button>
              </div>
              {userNavigation && (
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${currentVariant.userEmail} ${currentVariant.hover} hover:text-white`}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
