import React from "react";
import { Button } from "@/components/Button";
import { BookingStatus } from "../types/booking.types";

interface BookingDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvents: Array<{
    id: string;
    title: string;
    start: string;
    status: BookingStatus;
    bookingId: string;
  }>;
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

const BookingDetailsPanel: React.FC<BookingDetailsPanelProps> = ({
  isOpen,
  onClose,
  selectedEvents,
  onViewBooking,
  variant = "primary",
}) => {
  if (!isOpen || selectedEvents.length === 0) return null;

  return (
    <div className="bg-white shadow-md rounded-b-lg divide-y divide-gray-200">
      {selectedEvents.map((event) => (
        <div key={event.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {event.title}
              </h4>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : event.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : event.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>

            <Button
              variant={variant}
              size="small"
              onClick={() => onViewBooking && onViewBooking(event.bookingId)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingDetailsPanel;
