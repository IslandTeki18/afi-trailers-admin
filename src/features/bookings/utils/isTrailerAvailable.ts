import { arePeriodsOverlapping } from "./arePeriodsOverlapping";
import { Booking } from "../types/booking.types";

/**
 * Check if a trailer is available for the specified date range
 */
export const isTrailerAvailable = (
  trailerId: string,
  startDate: Date,
  endDate: Date,
  existingBookings: Booking[],
  currentBookingId?: string // Pass this to exclude the current booking when updating
): boolean => {
  // Filter bookings for the selected trailer
  const trailerBookings = existingBookings.filter(
    (booking) =>
      booking.trailerId === trailerId && booking._id !== currentBookingId
  );

  // Check for overlaps with any existing booking
  for (const booking of trailerBookings) {
    if (
      arePeriodsOverlapping(
        startDate,
        endDate,
        new Date(booking.startDate),
        new Date(booking.endDate)
      )
    ) {
      return false; // Found an overlap
    }
  }

  return true; // No overlaps found
};
