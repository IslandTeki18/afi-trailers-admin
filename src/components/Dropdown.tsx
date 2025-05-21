import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type DropdownItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "link" | "button";
};

type DropdownProps = {
  label?: string;
  items: DropdownItem[];
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "error"
    | "warning"
    | "base"
    | "info";
};

export const Dropdown = ({
  label = "Options",
  items,
  className = "",
  variant = "primary",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getMenuStyles = (): string => {
    const baseStyles =
      "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-base-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-100 ease-in-out";

    if (!isAnimating && !isOpen) return `${baseStyles} hidden`;

    if (isOpen) {
      return `${baseStyles} opacity-100 scale-100`;
    }

    return `${baseStyles} opacity-0 scale-95`;
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <div>
        <Button
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          variant={variant}
          className="flex justify-center items-center gap-4"
        >
          {label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      <div
        className={getMenuStyles()}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="p-2 space-y-1" role="none">
          {items.map((item, index) => {
            if (item.type === "button") {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  role="menuitem"
                  tabIndex={-1}
                  className="w-full"
                >
                  {item.label}
                </Button>
              );
            }

            return (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100 hover:text-base-900 focus:bg-base-100 focus:text-base-900 focus:outline-none"
                role="menuitem"
                tabIndex={-1}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
