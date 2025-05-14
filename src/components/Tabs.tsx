import * as React from "react";
import { useState, useEffect } from "react";
import { Select, SelectOption } from "./Select";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TabItem = {
  id: string;
  label: string;
  value: any;
  icon?: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "error"
    | "warning"
    | "base"
    | "gray"
    | "info";
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
};

const colorVariants = {
  primary: {
    active: "border-primary-500 text-primary-600",
    hover: "hover:border-primary-300 hover:text-primary-700",
    text: "text-primary-500",
    icon: "text-primary-400 group-hover:text-primary-500",
  },
  secondary: {
    active: "border-secondary-500 text-secondary-600",
    hover: "hover:border-secondary-300 hover:text-secondary-700",
    text: "text-secondary-500",
    icon: "text-secondary-400 group-hover:text-secondary-500",
  },
  accent: {
    active: "border-accent-500 text-accent-600",
    hover: "hover:border-accent-300 hover:text-accent-700",
    text: "text-accent-500",
    icon: "text-accent-400 group-hover:text-accent-500",
  },
  success: {
    active: "border-lime-500 text-lime-300",
    hover: "hover:border-success hover:text-success",
    text: "text-neutral-500",
    icon: "text-neutral-400 group-hover:text-success",
  },
  error: {
    active: "border-rose-500 text-red-600",
    hover: "hover:border-red-300 hover:text-red-700",
    text: "text-neutral-500",
    icon: "text-neutral-400 group-hover:text-error",
  },
  warning: {
    active: "border-yellow-500 text-yellow-600",
    hover: "hover:border-yellow-300 hover:text-yellow-700",
    text: "text-gray-500",
    icon: "text-gray-400 group-hover:text-yellow-500",
  },
  info: {
    active: "border-blue-400 text-blue-500",
    hover: "hover:border-blue-400 hover:text-blue-400",
    text: "text-gray-500",
    icon: "text-gray-400 group-hover:text-info",
  },
  base: {
    active: "border-gray-500 text-gray-600",
    hover: "hover:border-gray-300 hover:text-gray-700",
    text: "text-gray-500",
    icon: "text-gray-400 group-hover:text-gray-500",
  },
  gray: {
    active: "border-gray-500 text-gray-600",
    hover: "hover:border-gray-300 hover:text-gray-700",
    text: "text-gray-500",
    icon: "text-gray-400 group-hover:text-gray-500",
  },
};

export const Tabs = ({
  items,
  variant = "primary",
  defaultTab,
  className = "",
  onTabChange,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const colors = colorVariants[variant];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Handle mobile select change
  const handleSelectChange = (
    option: SelectOption,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Find the corresponding tab item using the value
    const selectedItem = items.find((item) => item.id === option.value);
    if (selectedItem) {
      handleTabChange(selectedItem.id);
    }
  };

  // Initialize with defaultTab if provided
  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <div className={classNames("w-full", className)}>
      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <Select
          variant={variant}
          label="Choose an option"
          options={items.map((item) => ({
            value: item.id,
            label: item.label,
          }))}
          id="tabs-select"
          value={activeTab}
          onOptionChange={handleSelectChange}
        />
      </div>

      {/* Desktop tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200/50">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={classNames(
                    "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium",
                    isActive ? colors.active : colors.text,
                    isActive ? colors.active : colors.hover,
                    "border-transparent"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon && (
                    <span
                      className={classNames(
                        "-ml-0.5 mr-2 h-5 w-5",
                        isActive ? colors.active : colors.icon
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {items.find((item) => item.id === activeTab)?.value}
      </div>
    </div>
  );
};
