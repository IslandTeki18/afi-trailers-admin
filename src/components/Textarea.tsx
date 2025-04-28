import * as React from "react";

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "error";
  darkMode?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  variant = "primary",
}) => {
  const baseClasses =
    "block w-full rounded-md border-0 py-1.5 shadow-sm sm:text-sm sm:leading-6";

  const variantClasses = {
    primary: `bg-base-500 text-white ring-1 ring-inset ring-primary-300 focus:ring-2 focus:ring-inset focus:ring-primary-300 placeholder:text-base-200`,
    secondary: `bg-base-500 text-white ring-1 ring-inset ring-secondary-300 focus:ring-2 focus:ring-inset focus:ring-secondary-400 placeholder:text-base-200`,
    accent: `bg-base-500 text-white ring-1 ring-inset ring-accent-300 focus:ring-2 focus:ring-inset focus:ring-accent-500 placeholder:text-base-100`,
    info: `bg-base-500 text-white ring-1 ring-inset ring-info focus:ring-2 focus:ring-inset focus:ring-info placeholder:text-base-200`,
    warning: `bg-base-500 text-white ring-1 ring-inset ring-warning focus:ring-2 focus:ring-inset focus:ring-warning placeholder:text-base-200`,
    success: `bg-base-500 text-white ring-1 ring-inset ring-success focus:ring-2 focus:ring-inset focus:ring-success placeholder:text-base-200`,
    error: `bg-base-500 text-white ring-1 ring-inset ring-error focus:ring-2 focus:ring-inset focus:ring-error placeholder:text-base-200`,
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${baseClasses} ${variantClasses[variant]}`}
    />
  );
};
