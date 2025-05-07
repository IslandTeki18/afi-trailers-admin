import { UserIcon } from "@heroicons/react/24/outline";

type FooterProps = {
  variant: "primary" | "secondary" | "accent" | "neutral";
  companyName: string;
  logo: string;
  description: string;
};

type FooterSection = {
  title: string;
  links: { name: string; href: string }[];
};

export const Footer: React.FC<FooterProps> = ({
  variant,
  companyName,
  logo,
  description,
}) => {
  const baseClasses = "transition-colors";
  const variantClasses = {
    primary: "bg-blue-900 text-white dark:bg-blue-800",
    secondary: "bg-base-900 text-white dark:bg-gray-800",
    accent: "bg-indigo-900 text-white dark:bg-indigo-800",
    neutral: "bg-slate-900 text-white dark:bg-slate-800",
  };

  const sections: FooterSection[] = [
    {
      title: "Solutions",
      links: [
        { name: "Marketing", href: "#" },
        { name: "Analytics", href: "#" },
        { name: "Commerce", href: "#" },
        { name: "Insights", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Pricing", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Guides", href: "#" },
        { name: "API Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Jobs", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Claim", href: "#" },
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "X",
      href: "#",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "GitHub",
      href: "#",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "YouTube",
      href: "#",
      icon: <UserIcon className="h-6 w-6" />,
    },
  ];

  return (
    <footer
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <img className="h-7" src={logo} alt={companyName} />
            <p className="text-sm leading-6 text-gray-300">{description}</p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-400"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.slice(0, 2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.slice(2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {section.title}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} {companyName}, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
