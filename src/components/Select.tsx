import * as React from "react";

type SelectVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  label?: string;
  options: any[];
  id: string;
}

export const Select: React.FC<SelectProps> = ({
  variant = "primary",
  label,
  options,
  id,
  className = "",
  ...props
}) => {
  const baseClasses =
    "rounded-md border-0 py-1.5 pl-3 pr-10 sm:text-sm sm:leading-6";

  const variantClasses = {
    primary:
      "bg-primary-200 border-primary-500 text-primary-900 focus:ring-2 focus:ring-primary-600 ring-1 ring-inset ring-primary-300",
    secondary:
      "bg-secondary-100 border-secondary-500 text-secondary-900 focus:ring-2 focus:ring-secondary-600 ring-1 ring-inset ring-secondary-300",
    accent:
      "bg-accent-100 border-accent-500 text-accent-900 focus:ring-2 focus:ring-accent-600 ring-1 ring-inset ring-accent-300",
    warning:
      "bg-warning border-warning text-base-500 focus:ring-2 focus:ring-warning/60 ring-1 ring-inset ring-warning",
    success:
      "bg-success border-success text-base-500 focus:ring-2 focus:ring-success/60 ring-1 ring-inset ring-success",
    info: "bg-info border-info text-base-500 focus:ring-2 focus:ring-info/60 ring-1 ring-inset ring-info",
    error:
      "bg-error border-error text-white focus:ring-2 focus:ring-error/60 ring-1 ring-inset ring-error",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1 font-medium text-white">
          {label}
        </label>
      )}
      <select className={combinedClasses} {...props} id={id}>
        {options.map((option, idx) => (
          <option
            key={`option-item-${idx}`}
            value={option.value}
            className="absolute"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
