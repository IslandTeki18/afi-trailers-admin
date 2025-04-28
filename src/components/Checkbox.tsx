import * as React from "react";

type CheckboxVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: CheckboxVariant;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  variant = "primary",
  label,
  className = "",
  ...props
}) => {
  const baseClasses = "form-checkbox h-5 w-5 rounded transition-colors";

  const variantClasses = {
    primary: "text-primary-600 focus:ring-primary-600",
    secondary: "text-secondary-600 focus:ring-secondary-600",
    accent: "text-accent-600 focus:ring-accent-600",
    success: "text-success focus:ring-green",
    info: "text-info focus:ring-info",
    warning: "text-warning focus:ring-warning",
    error: "text-error focus:ring-error",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className="flex items-center">
      <input type="checkbox" className={combinedClasses} {...props} />
      {label && <label className="ml-2 text-base-50">{label}</label>}
    </div>
  );
};
