type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error"
  | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  size = "medium",
  ...props
}) => {
  const buttonSizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const baseClasses = `rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${buttonSizeClasses[size]}`;

  const variantClasses = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-400 disabled:cursor-not-allowed",
    secondary:
      "bg-secondary-500 text-white hover:bg-secondary-600 disabled:bg-secondary-400 disabled:cursor-not-allowed",
    accent:
      "bg-accent-500 text-white hover:bg-accent-600 disabled:bg-accent-400 disabled:cursor-not-allowed",
    success:
      "bg-success text-base-500 hover:bg-success/80 disabled:bg-success-400 disabled:cursor-not-allowed",
    warning:
      "bg-warning text-white hover:bg-warning/80 disabled:bg-accent/60 disabled:cursor-not-allowed",
    info: "bg-info text-white hover:bg-info/80 disabled:bg-info-400 disabled:cursor-not-allowed",
    error:
      "bg-error text-white hover:bg-error/80 disabled:bg-error-400 disabled:cursor-not-allowed",
    link: "text-base-500 hover:text-base-600 disabled:text-base-400 disabled:cursor-not-allowed",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
