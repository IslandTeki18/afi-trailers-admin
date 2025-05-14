import React from "react";
import { format } from "date-fns";

interface TrailerAvailabilityStatusProps {
  isAvailable: boolean;
  nextAvailableDate?: Date | string | null;
  className?: string;
  showLabel?: boolean;
}

export const TrailerAvailabilityStatus: React.FC<
  TrailerAvailabilityStatusProps
> = ({ isAvailable, nextAvailableDate, className = "", showLabel = true }) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span
        className={`inline-block w-3 h-3 rounded-full mr-2 ${
          isAvailable ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {showLabel && (
        <span className="text-sm">
          {isAvailable ? "Available" : "Unavailable"}
          {!isAvailable && nextAvailableDate && (
            <span className="text-xs text-gray-500 ml-2">
              Available from: {formatDate(nextAvailableDate)}
            </span>
          )}
        </span>
      )}
    </div>
  );
};
