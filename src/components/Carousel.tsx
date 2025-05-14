import * as React from "react";
import { useState, useEffect } from "react";

interface CarouselProps {
  images: string[];
  interval?: number;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "error"
    | "warning"
    | "base"
    | "gray"
    | "info";
  showNavigation?: boolean;
}

const getVariantClasses = (variant: string) => {
  const baseClasses = "transition-colors duration-200";
  const variantClasses = {
    primary:
      "bg-primary-500 hover:bg-primary-400 dark:bg-primary-700 dark:hover:bg-primary-600 text-white",
    secondary:
      "bg-secondary-200 hover:bg-secondary-300 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-800 dark:text-white",
    accent:
      "bg-accent-500 hover:bg-accent-400 dark:bg-accent-700 dark:hover:bg-accent-600 text-white",
    success:
      "bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600 text-white",
    error:
      "bg-red-500 hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-600 text-white",
    warning:
      "bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white",
    info: "bg-blue-500 hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 text-white",
    base: "bg-gray-500 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-white",
    gray: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white",
  };
  // @ts-ignore
  return `${baseClasses} ${variantClasses[variant] || variantClasses.primary}`;
};

export const Carousel: React.FC<CarouselProps> = ({
  images,
  interval = 5000,
  variant = "primary",
  showNavigation = true, // Default to true for backward compatibility
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-96 object-cover flex-shrink-0"
            />
          ))}
        </div>
        {showNavigation && (
          <>
            <button
              className={`absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full ${getVariantClasses(
                variant
              )}`}
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full ${getVariantClasses(
                variant
              )}`}
              onClick={goToNext}
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex
                ? getVariantClasses(variant)
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
