import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "./Button";

type ToastVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  id?: number;
  createdAt?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "primary",
  duration = 3000,
  onClose,
  createdAt = Date.now(),
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseClasses = "p-4 rounded-md shadow-lg w-full max-w-sm";

  const variantClasses: Record<ToastVariant, string> = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-secondary-500 text-white",
    accent: "bg-accent-500 text-white",
    success: "bg-lime-500 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const animationClasses = `
    transform transition-all duration-500 ease-in-out
    ${isVisible && !isLeaving ? "translate-y-0 opacity-100" : ""}
    ${!isVisible && !isLeaving ? "-translate-y-full opacity-0" : ""}
    ${isLeaving ? "-translate-x-full opacity-0" : ""}
  `;

  const updateProgress = useCallback(() => {
    const elapsedTime = Date.now() - createdAt;
    const newProgress = Math.min(elapsedTime / duration, 1);
    setProgress(newProgress);

    if (newProgress >= 1) {
      handleClose();
    }
  }, [createdAt, duration]);

  useEffect(() => {
    const timer = setInterval(updateProgress, 100);
    return () => clearInterval(timer);
  }, [updateProgress]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div>{message}</div>
        <Button onClick={handleClose} aria-label="Close" variant={variant}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
      <div className="mt-2 w-full bg-white bg-opacity-30 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${(1 - progress) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
