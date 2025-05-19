import * as React from "react";

type SelectVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "base"
  | "gray"
  | "error";

// Improve type safety with a proper type for options
export type SelectOption = {
  value: string;
  label: string;
  [key: string]: any; // Allow additional properties
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  label?: string;
  options: SelectOption[];
  id: string;
  onOptionChange?: (
    option: SelectOption,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

export const Select: React.FC<SelectProps> = ({
  variant = "primary",
  label,
  options,
  id,
  className = "",
  onChange,
  onOptionChange,
  required = false,
  ...props
}) => {
  const baseClasses =
    "rounded-md border-0 py-[.55rem] pl-3 pr-10 sm:text-sm sm:leading-6";

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
    base: "bg-white border border-base-500 text-base-500 focus:ring-2 focus:ring-base/60 ring-1 ring-inset ring-base",
    gray: "bg-gray-100 border-gray-500 text-gray-800 focus:ring-2 focus:ring-gray/60 ring-1 ring-inset ring-gray",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // Handler function that calls both standard onChange and enhanced onOptionChange
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Call the original onChange if provided
    if (onChange) {
      onChange(e);
    }

    // Call the enhanced onOptionChange with the full option object
    if (onOptionChange) {
      const selectedValue = e.target.value;
      const selectedOption = options.find((opt) => opt.value === selectedValue);

      if (selectedOption) {
        onOptionChange(selectedOption, e);
      }
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      <select
        className={combinedClasses}
        {...props}
        id={id}
        onChange={handleChange}
        required={required}
      >
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
