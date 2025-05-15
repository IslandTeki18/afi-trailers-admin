import * as React from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "error"
  | "base"
  | "gray"
  | "warning"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variantClasses: Record<BadgeVariant, string> = {
    primary: "bg-primary-500 text-neutral-50",
    secondary: "bg-secondary-500 text-neutral-50",
    accent: "bg-accent-500 text-neutral-800",
    success: "bg-success text-neutral-800",
    error: "bg-error text-neutral-50",
    warning: "bg-warning text-neutral-800",
    info: "bg-info text-neutral-800",
    base: "bg-base-500 text-neutral-50",
    gray: "bg-gray-500 text-neutral-50",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
