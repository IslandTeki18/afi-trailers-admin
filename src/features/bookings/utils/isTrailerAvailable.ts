import { Booking, TimeBlock } from "../types/booking.types";

export const isTrailerAvailable = (
  trailerId: string,
  startDate: Date,
  endDate: Date,
  existingBookings: Booking[] = [],
  currentBookingId?: string,
  timeBlocks: TimeBlock[] = []
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const booking of existingBookings) {
    if (currentBookingId && booking._id === currentBookingId) {
      continue;
    }

    if (booking.trailerId !== trailerId) {
      continue;
    }

    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);

    if (
      (start <= bookingEnd && start >= bookingStart) ||
      (end >= bookingStart && end <= bookingEnd) ||
      (start <= bookingStart && end >= bookingEnd)
    ) {
      return false;
    }
  }

  for (const block of timeBlocks) {
    if (!block.isActive) continue;

    if (block.affectsAllTrailers || block.trailerId === trailerId) {
      const blockStart = new Date(block.startDate);
      const blockEnd = new Date(block.endDate);

      if (
        (start <= blockEnd && start >= blockStart) ||
        (end >= blockStart && end <= blockEnd) ||
        (start <= blockStart && end >= blockEnd)
      ) {
        return false;
      }
    }
  }

  return true;
};
