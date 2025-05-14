import React from "react";
import { format } from "date-fns";
import { Button } from "../../../components/Button";
import { BookingStatus } from "../types/booking.types";

interface BookingDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: {
    id: string;
    title: string;
    start: string;
    status: BookingStatus;
    bookingId: string;
  };
  onViewBooking?: (bookingId: string) => void;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "base"
    | "gray"
    | "info";
}

export const BookingDetailsPanel: React.FC<BookingDetailsPanelProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  onViewBooking,
  variant = "primary",
}) => {
  if (!isOpen || !selectedEvent) return null;

  // Status color mapping
  const statusColorClass = () => {
    switch (selectedEvent.status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {selectedEvent.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Booking ID: {selectedEvent.id}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColorClass()}`}
          >
            {selectedEvent.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div className="col-span-1">
            <span className="text-sm font-medium text-gray-500">Date</span>
            <p className="text-sm text-gray-900">
              {format(new Date(selectedEvent.start), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant={variant}
            size="small"
            onClick={() =>
              onViewBooking && onViewBooking(selectedEvent.bookingId)
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPanel;
