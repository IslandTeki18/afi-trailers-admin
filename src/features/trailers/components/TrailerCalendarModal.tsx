import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal";
import { Trailer } from "../types/trailer.types";
import { Booking } from "../../bookings/types/booking.types";
import TrailerBookingCalendar from "./TrailerBookingCalendar";
import { fetchBookings } from "../../bookings/api/fetchBookings";

interface TrailerCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer;
  onAddBooking?: (date: Date) => void;
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

export const TrailerCalendarModal: React.FC<TrailerCalendarModalProps> = ({
  isOpen,
  onClose,
  trailer,
  onAddBooking,
  onViewBooking,
  variant = "primary",
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      if (isOpen && trailer._id) {
        setIsLoading(true);
        try {
          const response = await fetchBookings({
            trailerId: trailer._id,
            limit: 100,
          });

          if (response && response.bookings) {
            console.log(
              `Loaded ${response.bookings.length} bookings for trailer ${trailer._id}`
            );
            setBookings(response.bookings);
          } else {
            console.error("Unexpected API response format:", response);
            setBookings([]);
          }
        } catch (error) {
          console.error("Error loading trailer bookings:", error);
          setBookings([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBookings();
  }, [isOpen, trailer._id]);

  // Handle adding a booking for this specific trailer
  const handleAddBooking = (date: Date) => {
    if (onAddBooking) {
      onAddBooking(date);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="5xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Bookings for {trailer.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TrailerBookingCalendar
            trailer={trailer}
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onViewBooking={onViewBooking}
            variant={variant}
          />
        )}
      </div>
    </Modal>
  );
};

export default TrailerCalendarModal;
