
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  count?: string;
}

interface TeamItem {
  name: string;
  href: string;
  initial: string;
  current?: boolean;
}

type ColorVariant = "primary" | "secondary" | "success" | "danger";

interface SidenavProps {
  navigation: NavItem[];
  teams: TeamItem[];
  variant?: ColorVariant;
}

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const variantClasses: Record<
  ColorVariant,
  {
    bg: string;
    hoverBg: string;
    text: string;
    hoverText: string;
    activeText: string;
    borderColor: string;
  }
> = {
  primary: {
    bg: "bg-indigo-600",
    hoverBg: "hover:bg-indigo-700",
    text: "text-indigo-200",
    hoverText: "hover:text-white",
    activeText: "text-white",
    borderColor: "border-indigo-400",
  },
  secondary: {
    bg: "bg-gray-600",
    hoverBg: "hover:bg-gray-700",
    text: "text-gray-200",
    hoverText: "hover:text-white",
    activeText: "text-white",
    borderColor: "border-gray-400",
  },
  success: {
    bg: "bg-green-600",
    hoverBg: "hover:bg-green-700",
    text: "text-green-200",
    hoverText: "hover:text-white",
    activeText: "text-white",
    borderColor: "border-green-400",
  },
  danger: {
    bg: "bg-red-600",
    hoverBg: "hover:bg-red-700",
    text: "text-red-200",
    hoverText: "hover:text-white",
    activeText: "text-white",
    borderColor: "border-red-400",
  },
};

export const Sidenav: React.FC<SidenavProps> = ({
  navigation,
  teams,
  variant = "primary",
}) => {
  const colors = variantClasses[variant];

  return (
    <div
      className={`h-full flex grow flex-col gap-y-5 overflow-y-auto ${colors.bg} px-6`}
    >
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Your Company"
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
                        ? `${colors.hoverBg} ${colors.activeText}`
                        : `${colors.text} ${colors.hoverBg} ${colors.hoverText}`,
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <item.icon
                      aria-hidden="true"
                      className={classNames(
                        item.current
                          ? colors.activeText
                          : `${colors.text} group-hover:${colors.activeText}`,
                        "h-6 w-6 shrink-0"
                      )}
                    />
                    {item.name}
                    {item.count ? (
                      <span
                        className={`ml-auto w-9 min-w-max whitespace-nowrap rounded-full ${colors.bg} px-2.5 py-0.5 text-center text-xs font-medium leading-5 ${colors.activeText} ring-1 ring-inset ring-${variant}-500`}
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
            <div className={`text-xs font-semibold leading-6 ${colors.text}`}>
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <a
                    href={team.href}
                    className={classNames(
                      team.current
                        ? `${colors.hoverBg} ${colors.activeText}`
                        : `${colors.text} ${colors.hoverBg} ${colors.hoverText}`,
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                    )}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${colors.borderColor} ${colors.bg} text-[0.625rem] font-medium ${colors.activeText}`}
                    >
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className={`flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 ${colors.activeText} ${colors.hoverBg}`}
            >
              <img
                className={`h-8 w-8 rounded-full ${colors.hoverBg}`}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
