import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  count?: string;
}

interface TeamItem {
  id?: number;
  name: string;
  href: string;
  initial: string;
  current?: boolean;
}

interface UserNavItem {
  name: string;
  href: string;
}

type ColorVariant = "primary" | "secondary" | "success" | "danger";

interface SidenavProps {
  navigation: NavItem[];
  teams: TeamItem[];
  userNavigation?: UserNavItem[];
  variant?: ColorVariant;
  logoSrc?: string;
  userName?: string;
  userImgSrc?: string;
  children?: React.ReactNode;
}

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const Sidenav: React.FC<SidenavProps> = ({
  navigation,
  children,
  teams,
  userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ],
  variant = "primary",
  logoSrc = "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white",
  userName = "Tom Cook",
  userImgSrc = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Default to primary variant styling
  const bgColor = "bg-indigo-600";
  const hoverBgColor = "bg-indigo-700";
  const textColor = "text-indigo-200";
  const hoverTextColor = "text-white";
  const activeTextColor = "text-white";
  const borderColor = "border-indigo-400";
  const bgSecondaryColor = "bg-indigo-500";

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-base-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Mobile sidebar component */}
              <div
                className={`flex grow flex-col gap-y-5 overflow-y-auto ${bgColor} px-6 pb-4`}
              >
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src={logoSrc}
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? `${hoverBgColor} ${activeTextColor}`
                                  : `${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`,
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? activeTextColor
                                    : `${textColor} group-hover:${activeTextColor}`,
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                              {item.count ? (
                                <span
                                  className={`ml-auto w-9 min-w-max whitespace-nowrap rounded-full ${bgColor} px-2.5 py-0.5 text-center text-xs font-medium leading-5 ${activeTextColor} ring-1 ring-inset`}
                                  aria-hidden="true"
                                >
                                  {item.count}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-indigo-200">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={classNames(
                                team.current
                                  ? `${hoverBgColor} ${activeTextColor}`
                                  : `${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`,
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <span
                                className={`flex size-6 shrink-0 items-center justify-center rounded-lg border ${borderColor} ${bgSecondaryColor} text-[0.625rem] font-medium ${activeTextColor}`}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`}
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className={`size-6 shrink-0 ${textColor} group-hover:${hoverTextColor}`}
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div
            className={`flex grow flex-col gap-y-5 overflow-y-auto ${bgColor} px-6 pb-4`}
          >
            <div className="flex h-16 shrink-0 items-center">
              <img alt="Your Company" src={logoSrc} className="h-8 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? `${hoverBgColor} ${activeTextColor}`
                              : `${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`,
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? activeTextColor
                                : `${textColor} group-hover:${activeTextColor}`,
                              "size-6 shrink-0"
                            )}
                          />
                          {item.name}
                          {item.count ? (
                            <span
                              className={`ml-auto w-9 min-w-max whitespace-nowrap rounded-full ${bgColor} px-2.5 py-0.5 text-center text-xs font-medium leading-5 ${activeTextColor} ring-1 ring-inset`}
                              aria-hidden="true"
                            >
                              {item.count}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs/6 font-semibold text-indigo-200">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? `${hoverBgColor} ${activeTextColor}`
                              : `${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`,
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-lg border ${borderColor} ${bgSecondaryColor} text-[0.625rem] font-medium ${activeTextColor}`}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${textColor} hover:${hoverBgColor} hover:${hoverTextColor}`}
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className={`size-6 shrink-0 ${textColor} group-hover:${hoverTextColor}`}
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-base-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-base-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={userImgSrc}
                      className="size-8 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {userName}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Sidenav;
