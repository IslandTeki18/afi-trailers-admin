import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

// Define the props interface for our component
interface DrawerProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  position?: "right" | "left";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  bgColor?: string;
  titleColor?: string;
  animationDuration?: number;
  closeButtonColor?: string;
  closeButtonHoverColor?: string;
  closeButtonRingColor?: string;
}

export const Drawer = ({
  isOpen = false,
  onClose,
  title = "Panel title",
  children,
  position = "right",
  maxWidth = "md",
  bgColor = "bg-white",
  titleColor = "text-gray-900",
  animationDuration = 500,
}: DrawerProps) => {
  const positionClass = position === "right" ? "right-0 pl-10" : "left-0 pr-10";
  const translateClass =
    position === "right"
      ? isOpen
        ? ""
        : "translate-x-full"
      : isOpen
      ? ""
      : "-translate-x-full";

  // Function to get max width class using switch statement
  const getMaxWidthClass = (width: string): string => {
    switch (width) {
      case "xs":
        return "max-w-xs";
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "full":
        return "max-w-full";
      default:
        return "max-w-md";
    }
  };

  // Get the appropriate max width class
  const maxWidthClass = getMaxWidthClass(maxWidth);

  // Convert animation duration to CSS
  const durationStyle = {
    transitionDuration: `${animationDuration}ms`,
  };

  return (
    <div
      className={`relative z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`fixed inset-0 transition-opacity ${
          isOpen ? "bg-black/30" : "bg-transparent pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`pointer-events-none fixed inset-y-0 flex max-w-full ${positionClass}`}
          >
            <div
              className={`pointer-events-auto w-screen ${maxWidthClass} transform transition ease-in-out ${translateClass}`}
              style={durationStyle}
            >
              <div
                className={`flex h-full flex-col overflow-y-scroll ${bgColor} py-6 shadow-xl`}
              >
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className={`text-base font-semibold ${titleColor}`}>
                      {title}
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <Button type="button" onClick={onClose} variant="link">
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-10 w-10" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
