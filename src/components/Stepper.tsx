import { CheckIcon } from "@heroicons/react/24/outline";
import * as React from "react";

interface Step {
  id: string;
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
}

interface StepperProps {
  steps: Step[];
  variant?: "primary" | "secondary" | "accent";
  onStepClick?: (stepIndex: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  variant = "primary",
  onStepClick,
}) => {
  const getVariantClasses = (status: string) => {
    // ...existing code...
    const baseClasses = {
      complete: {
        bg: "bg-indigo-600 group-hover:bg-indigo-800",
        text: "text-white",
        border: "",
      },
      current: {
        bg: "bg-white",
        text: "text-indigo-600",
        border: "border-2 border-indigo-600",
      },
      upcoming: {
        bg: "bg-white",
        text: "text-gray-500 group-hover:text-gray-900",
        border: "border-2 border-gray-300 group-hover:border-gray-400",
      },
    };

    switch (variant) {
      case "secondary":
        baseClasses.complete.bg =
          "bg-secondary dark:bg-secondary-dark group-hover:bg-secondary-600 dark:group-hover:bg-secondary-400";
        baseClasses.current.text = "text-secondary dark:text-secondary-dark";
        baseClasses.current.border =
          "border-2 border-secondary dark:border-secondary-dark";
        break;
      case "accent":
        baseClasses.complete.bg =
          "bg-accent dark:bg-accent-dark group-hover:bg-accent-600 dark:group-hover:bg-accent-400";
        baseClasses.current.text = "text-accent dark:text-accent-dark";
        baseClasses.current.border =
          "border-2 border-accent dark:border-accent-dark";
        break;
      default:
        baseClasses.complete.bg =
          "bg-indigo-500 dark:bg-indigo-500-dark group-hover:bg-indigo-500-600 dark:group-hover:bg-indigo-500-400";
        baseClasses.current.text = "text-indigo-500 dark:text-indigo-500-dark";
        baseClasses.current.border =
          "border-2 border-indigo-500 dark:border-indigo-500-dark";
    }

    return baseClasses[status as keyof typeof baseClasses];
  };

  const handleStepClick = (index: number, step: Step) => {
    if (onStepClick && step.status !== "upcoming") {
      onStepClick(index);
    }
  };

  return (
    <nav aria-label="Progress" className="w-full overflow-hidden">
      {/* Scrollable container */}
      <div className="overflow-x-auto pb-2">
        <ol
          role="list"
          className="divide-y divide-gray-300 rounded-md border border-gray-300 md:inline-flex md:min-w-max md:divide-y-0 whitespace-nowrap"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex">
              {step.status === "complete" ? (
                <a
                  href={onStepClick ? "#" : step.href}
                  className={`group flex w-full items-center ${
                    onStepClick ? "cursor-pointer" : ""
                  }`}
                  onClick={(e) => {
                    if (onStepClick) {
                      e.preventDefault();
                      handleStepClick(stepIdx, step);
                    }
                  }}
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        getVariantClasses("complete").bg
                      }`}
                    >
                      <CheckIcon
                        aria-hidden="true"
                        className={`size-6 ${
                          getVariantClasses("complete").text
                        }`}
                      />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {step.name}
                    </span>
                  </span>
                </a>
              ) : step.status === "current" ? (
                <a
                  href={onStepClick ? "#" : step.href}
                  aria-current="step"
                  className={`flex items-center px-6 py-4 text-sm font-medium ${
                    onStepClick ? "cursor-pointer" : ""
                  }`}
                  onClick={(e) => {
                    if (onStepClick) {
                      e.preventDefault();
                      handleStepClick(stepIdx, step);
                    }
                  }}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      getVariantClasses("current").border
                    }`}
                  >
                    <span className={getVariantClasses("current").text}>
                      {step.id}
                    </span>
                  </span>
                  <span
                    className={`ml-4 text-sm font-medium ${
                      getVariantClasses("current").text
                    }`}
                  >
                    {step.name}
                  </span>
                </a>
              ) : (
                <a
                  href={onStepClick ? "#" : step.href}
                  className={`group flex items-center ${
                    onStepClick ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        getVariantClasses("upcoming").border
                      }`}
                    >
                      <span className={getVariantClasses("upcoming").text}>
                        {step.id}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100">
                      {step.name}
                    </span>
                  </span>
                </a>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="size-full text-gray-300 dark:text-gray-600"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
