import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "error"
    | "warning"
    | "info";
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  variant = "primary",
}) => {
  const baseClasses =
    "relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: `${checked ? "bg-primary-500" : "bg-gray-200"}`,
    secondary: `${checked ? "bg-secondary-500" : "bg-gray-200"}`,
    accent: `${checked ? "bg-accent-500" : "bg-gray-200"}`,
    info: `${checked ? "bg-info" : "bg-gray-200"}`,
    success: `${checked ? "bg-success" : "bg-gray-200"}`,
    warning: `${checked ? "bg-warning" : "bg-gray-200"}`,
    error: `${checked ? "bg-error" : "bg-gray-200"}`,
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={() => onChange(checked)}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
      />
    </button>
  );
};
