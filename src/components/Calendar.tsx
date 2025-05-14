import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";

type Event = {
  id: number;
  name: string;
  time: string;
  datetime: string;
  href: string;
};

type Day = {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  events: Event[];
};

interface CalendarProps {
  days?: Day[];
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "base"
    | "gray"
    | "info";
  onAddEvent?: () => void;
  onDaySelect?: (day: Day) => void;
  onViewChange?: (view: "day" | "week" | "month" | "year") => void;
  title?: string;
  currentMonth?: string;
  currentYear?: number;
  view?: "day" | "week" | "month" | "year";
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

const defaultDays: Day[] = [
  { date: "2021-12-27", events: [] },
  { date: "2021-12-28", events: [] },
  { date: "2021-12-29", events: [] },
  { date: "2021-12-30", events: [] },
  { date: "2021-12-31", events: [] },
  { date: "2022-01-01", isCurrentMonth: true, events: [] },
  { date: "2022-01-02", isCurrentMonth: true, events: [] },
  {
    date: "2022-01-03",
    isCurrentMonth: true,
    events: [
      {
        id: 1,
        name: "Design review",
        time: "10AM",
        datetime: "2022-01-03T10:00",
        href: "#",
      },
      {
        id: 2,
        name: "Sales meeting",
        time: "2PM",
        datetime: "2022-01-03T14:00",
        href: "#",
      },
    ],
  },
  // Other days omitted for brevity
];

const colorVariants = {
  primary: {
    active: "bg-primary-600 text-white",
    hover: "hover:bg-primary-500",
    button:
      "bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600",
    dot: "bg-primary-400",
    link: "text-primary-600 hover:text-primary-700",
  },
  secondary: {
    active: "bg-secondary-600 text-white",
    hover: "hover:bg-secondary-500",
    button:
      "bg-secondary-600 hover:bg-secondary-500 focus-visible:outline-secondary-600",
    dot: "bg-secondary-400",
    link: "text-secondary-600 hover:text-secondary-700",
  },
  accent: {
    active: "bg-accent-600 text-white",
    hover: "hover:bg-accent-500",
    button:
      "bg-accent-600 hover:bg-accent-500 focus-visible:outline-accent-600",
    dot: "bg-accent-400",
    link: "text-accent-600 hover:text-accent-700",
  },
  error: {
    active: "bg-error text-white",
    hover: "hover:bg-error/80",
    button: "bg-error hover:bg-error/80 focus-visible:outline-error",
    dot: "bg-error/70",
    link: "text-error hover:text-error/80",
  },
  base: {
    active: "bg-base-900 text-white",
    hover: "hover:bg-base-800",
    button: "bg-base-900 hover:bg-base-800 focus-visible:outline-base-900",
    dot: "bg-base-400",
    link: "text-base-600 hover:text-base: 700",
  },
  gray: {
    active: "bg-gray-600 text-white",
    hover: "hover:bg-gray-500",
    button: "bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600",
    dot: "bg-gray-400",
    link: "text-gray-600 hover:text-gray-700",
  },
  info: {
    active: "bg-info text-white",
    hover: "hover:bg-info/80",
    button: "bg-info hover:bg-info/80 focus-visible:outline-info",
    dot: "bg-info/70",
    link: "text-info hover:text-info/80",
  },
};

export const Calendar: React.FC<CalendarProps> = ({
  days = defaultDays,
  variant = "primary",
  onAddEvent,
  onDaySelect,
  onViewChange,
  title = "Calendar",
  currentMonth = "January",
  currentYear = 2022,
  view = "month",
}) => {
  const colors = colorVariants[variant];
  const selectedDay = days.find((day) => day.isSelected);

  const handleDayClick = (day: Day) => {
    if (onDaySelect) {
      onDaySelect(day);
    }
  };

  const handleViewChange = (newView: "day" | "week" | "month" | "year") => {
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold text-gray-900">
          <time dateTime={`${currentYear}-${currentMonth}`}>
            {currentMonth} {currentYear}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {view.charAt(0).toUpperCase() + view.slice(1)} view
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>

              <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => handleViewChange("day")}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => handleViewChange("week")}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => handleViewChange("month")}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => handleViewChange("year")}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              onClick={onAddEvent}
              className={`ml-6 rounded-md ${colors.button} px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={onAddEvent}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Create event
                    </a>
                  )}
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Go to today
                    </a>
                  )}
                </MenuItem>
              </div>
              <div className="py-1">
                {["day", "week", "month", "year"].map((viewOption) => (
                  <MenuItem key={viewOption}>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() =>
                          handleViewChange(
                            viewOption as "day" | "week" | "month" | "year"
                          )
                        }
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {viewOption.charAt(0).toUpperCase() +
                          viewOption.slice(1)}{" "}
                        view
                      </a>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                onClick={() => handleDayClick(day)}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "relative px-3 py-2 cursor-pointer"
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isToday
                      ? `flex h-6 w-6 items-center justify-center rounded-full ${colors.active}`
                      : "",
                    day.isSelected ? "font-semibold" : "",
                    "block"
                  )}
                >
                  {day.date.split("-").pop()?.replace(/^0/, "")}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p
                            className={`flex-auto truncate font-medium text-gray-900 group-hover:${colors.link}`}
                          >
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className={`ml-3 hidden flex-none text-gray-500 group-hover:${colors.link} xl:block`}
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-gray-500">
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => handleDayClick(day)}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday || "") && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected && day.isToday && colors.link,
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-900",
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-500",
                  "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected &&
                      "flex h-6 w-6 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && colors.active,
                    day.isSelected && !day.isToday && "bg-gray-900",
                    "ml-auto"
                  )}
                >
                  {day.date.split("-").pop()?.replace(/^0/, "")}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span
                        key={event.id}
                        className={`mx-0.5 mb-1 h-1.5 w-1.5 rounded-full ${colors.dot}`}
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay!?.events.length > 0 && (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black/5">
            {selectedDay!.events.map((event) => (
              <li
                key={event.id}
                className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <time
                    dateTime={event.datetime}
                    className="mt-2 flex items-center text-gray-700"
                  >
                    <ClockIcon
                      className="mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {event.time}
                  </time>
                </div>
                <a
                  href={event.href}
                  className={`ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100`}
                >
                  Edit<span className="sr-only">, {event.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Calendar;
