import * as React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "base"
    | "gray"
    | "error";
  darkMode?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  variant = "primary",
  id,
  name,
  className = "",
  defaultValue,
  ...props
}) => {
  // Base styling that matches the reference textarea
  const baseClasses =
    "block w-full rounded-md px-3 py-1.5 text-base outline outline-1 -outline-offset-1 sm:text-sm/6";

  const variantClasses = {
    primary: `bg-white text-neutral-900 outline-primary-300 placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600`,
    secondary: `bg-white text-neutral-900 outline-secondary-300 placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary-600`,
    accent: `bg-white text-neutral-900 outline-accent-300 placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600`,
    info: `bg-white text-neutral-900 outline-info placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-info`,
    warning: `bg-white text-neutral-900 outline-warning placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-warning`,
    success: `bg-white text-neutral-900 outline-success placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-success`,
    error: `bg-white text-neutral-900 outline-error placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-error`,
    base: `bg-white text-base-900 outline-base-500 placeholder:text-base-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-base`,
    gray: `bg-white text-neutral-900 outline-gray placeholder:text-neutral-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray`,
  };

  // Dark mode variants (if needed)
  const darkModeClasses = {
    primary: `bg-base-500 text-white outline-primary-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-400`,
    secondary: `bg-base-500 text-white outline-secondary-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary-400`,
    accent: `bg-base-500 text-white outline-accent-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent-400`,
    info: `bg-base-500 text-white outline-info placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-info`,
    warning: `bg-base-500 text-white outline-warning placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-warning`,
    success: `bg-base-500 text-white outline-success placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-success`,
    error: `bg-base-500 text-white outline-error placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-error`,
    base: `bg-base-500 text-white outline-base placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-base`,
    gray: `bg-base-500 text-white outline-gray placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray`,
  };

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      defaultValue={defaultValue}
      className={`${baseClasses} ${
        props.darkMode ? darkModeClasses[variant] : variantClasses[variant]
      } ${className}`}
      {...props}
    />
  );
};
