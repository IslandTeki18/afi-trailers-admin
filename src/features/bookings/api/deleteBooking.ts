import { axiosInstance } from "../../../libs/axios";

/**
 * Deletes a booking by its ID
 * @param bookingId - The ID of the booking to delete
 * @returns Promise that resolves when the booking is successfully deleted
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/bookings/${bookingId}`);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};