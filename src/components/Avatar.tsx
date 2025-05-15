import * as React from "react";

type AvatarVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "gray"
  | "base"
  | "info";

interface AvatarProps {
  src?: string;
  alt: string;
  variant?: AvatarVariant;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full overflow-hidden";

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 text-base",
  };

  const variantClasses: Record<AvatarVariant, string> = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-secondary-500 text-white",
    accent: "bg-accent-500 text-white",
    success: "bg-success text-white",
    error: "bg-error text-white",
    warning: "bg-warning text-white",
    base: "bg-base-500 text-white",
    gray: "bg-gray-500 text-white",
    info: "bg-info text-white",
  };

  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const initialSize =
    size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-2xl";

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className={`${initialSize} tracking-widest`}>{initials}</span>
      )}
    </div>
  );
};
