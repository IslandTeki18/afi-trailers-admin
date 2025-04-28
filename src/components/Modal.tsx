import { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  maxWidth = "sm",
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsShowing(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isShowing) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isShowing, onClose]);

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isShowing]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isShowing) return null;

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-gray-500 transition-opacity duration-300 ease-out
          ${isClosing ? "opacity-0" : "opacity-75"}
        `}
        aria-hidden="true"
      />

      <div
        className="py-4 fixed inset-0 z-10 w-screen overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          onClick={handleBackdropClick}
        >
          <div
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 ease-out
              ${
                isClosing
                  ? "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  : "opacity-100 translate-y-0 sm:scale-100"
              }
              ${maxWidthClasses[maxWidth]} 
              ${className}
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
