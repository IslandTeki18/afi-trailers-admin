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
}

export const Input: React.FC<InputProps> = ({
  variant = "primary",
  label,
  className = "",
  id,
  ...props
}) => {
  const baseClasses =
    "px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors";

  const variantClasses = {
    primary:
      "border border-primary-300 focus:border-primary-500 focus:ring-primary-500 bg-base-500 text-neutral-100 placeholder:text-neutral-300",
    secondary:
      "border border-secondary-300 focus:border-secondary-500 focus:ring-secondary-400 bg-base-500 text-neutral-100 placeholder:text-neutral-300",
    accent:
      "border border-accent-300 focus:border-accent-500 focus:ring-accent-500 bg-base-500 text-neutral-100 placeholder:text-neutral-300",
    warning:
      "border border-warning focus:border-warning focus:ring-warning bg-base-500 text-white placeholder:text-neutral-300",
    success:
      "border border-success focus:border-success focus:ring-success bg-base-500 text-white placeholder:text-neutral-300",
    info: "border border-info focus:border-info focus:ring-info bg-base-500 text-white placeholder:text-neutral-300",
    error:
      "border border-error focus:border-error focus:ring-error bg-base-500 text-white placeholder:text-neutral-300",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1 font-medium transition-colors">
          {label}
        </label>
      )}
      <input className={combinedClasses} {...props} />
    </div>
  );
};
