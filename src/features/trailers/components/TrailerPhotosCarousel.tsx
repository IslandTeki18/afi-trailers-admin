import React from "react";
import { Carousel } from "../../../components/Carousel";

interface TrailerPhotosCarouselProps {
  photos: string[];
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
  interval?: number;
  className?: string;
}

export const TrailerPhotosCarousel: React.FC<TrailerPhotosCarouselProps> = ({
  photos,
  variant = "primary",
  interval = 5000,
  className = "",
}) => {
  const hasPhotos = photos && photos.length > 0;

  // Use placeholder only when rendering carousel but no photos
  const displayPhotos = hasPhotos
    ? photos
    : ["/images/placeholder-trailer.jpg"];

  return (
    <div className={`trailer-photos-carousel ${className}`}>
      {hasPhotos ? (
        <Carousel
          images={displayPhotos}
          variant={variant}
          interval={interval}
          showNavigation={displayPhotos.length > 1}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-md">
          <svg
            className="w-24 h-24 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            No photos available
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Photos will appear here once added
          </p>
        </div>
      )}
    </div>
  );
};
