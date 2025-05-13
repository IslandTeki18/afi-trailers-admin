import * as React from "react";

type InputVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  id?: string;
  darkMode?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = "primary",
  label,
  className = "",
  id,
  darkMode = false,
  ...props
}) => {
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
  };

  const darkModeClasses = {
    primary: `bg-base-500 text-white outline-primary-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-400`,
    secondary: `bg-base-500 text-white outline-secondary-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary-400`,
    accent: `bg-base-500 text-white outline-accent-500 placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent-400`,
    info: `bg-base-500 text-white outline-info placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-info`,
    warning: `bg-base-500 text-white outline-warning placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-warning`,
    success: `bg-base-500 text-white outline-success placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-success`,
    error: `bg-base-500 text-white outline-error placeholder:text-base-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-error`,
  };

  const combinedClasses = `${baseClasses} ${
    darkMode ? darkModeClasses[variant] : variantClasses[variant]
  } ${className}`;

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
        </label>
      )}
      <input id={id} className={combinedClasses} {...props} />
    </div>
  );
};
