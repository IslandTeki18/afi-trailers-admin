import React from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { EyeIcon, PencilIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Trailer } from "../types/trailer.types";

interface TrailerCardProps {
  trailer: Trailer;
  onView: (trailer: Trailer) => void;
  onEdit: (trailer: Trailer) => void;
}

const placeholderImage = "https://placehold.co/600x400?text=No+Trailer+Image";

export const TrailerCard: React.FC<TrailerCardProps> = ({
  trailer,
  onView,
  onEdit,
}) => {
    
  // Get active bookings count
  const getActiveBookingsCount = (trailer: Trailer) => {
    if (!trailer.bookedDates) return 0;
    const now = new Date();
    return trailer.bookedDates.filter(
      (booking: any) =>
        booking.status !== "cancelled" && new Date(booking.endDate) >= now
    ).length;
  };

  // Status badge variant mapping
  const statusVariantMap: Record<string, string> = {
    Operational: "success",
    Maintenance: "warning",
    "Out of Service": "error",
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
      {/* Trailer Image */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={(trailer.photos && trailer.photos[0]) || placeholderImage}
          alt={trailer.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={trailer.availability?.isAvailable ? "success" : "error"}
          >
            {trailer.availability?.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      {/* Trailer Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 truncate" title={trailer.name}>
            {trailer.name}
          </h3>
          <Badge
            //@ts-ignore
            variant={statusVariantMap[trailer.maintenanceStatus] || "gray"}
          >
            {trailer.maintenanceStatus}
          </Badge>
        </div>

        {/* Specs */}
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center text-sm">
            <div className="w-1/2">
              <span className="text-gray-500">Type:</span>{" "}
              <span className="font-medium">{trailer.type}</span>
            </div>
            <div className="w-1/2">
              <span className="text-gray-500">Capacity:</span>{" "}
              <span className="font-medium">{trailer.capacity}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center text-sm">
            <div className="w-1/2">
              <span className="text-gray-500">Daily Rate:</span>{" "}
              <span className="font-medium">
                ${trailer.rentalPrices?.fullDay?.toFixed(2) || "N/A"}
              </span>
            </div>
            <div className="w-1/2 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-indigo-500 flex-shrink-0" />
              <span className="text-gray-500 mr-1 whitespace-nowrap">
                Bookings:
              </span>
              <span className="font-medium">
                {getActiveBookingsCount(trailer)}
              </span>
            </div>
          </div>

          {/* Ratings row */}
          <div className="text-sm pt-1 border-t border-gray-100">
            <span className="text-gray-500">Rating:</span>{" "}
            <span className="font-medium">
              {trailer.ratings?.averageRating
                ? `${trailer.ratings.averageRating}/5`
                : "No ratings"}
            </span>
            {trailer.ratings?.totalReviews > 0 && (
              <span className="text-gray-500 text-xs ml-1">
                ({trailer.ratings.totalReviews}{" "}
                {trailer.ratings.totalReviews === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="base"
            size="small"
            onClick={() => onView(trailer)}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="gray"
            size="small"
            onClick={() => onEdit(trailer)}
            className="flex-1 flex items-center justify-center gap-1"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
