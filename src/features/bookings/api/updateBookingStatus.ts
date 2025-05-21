import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../libs/axios";
import { Booking, BookingStatus } from "../types/booking.types";

/**
 * Updates the status of a booking
 *
 * @param bookingId - The ID of the booking to update
 * @param newStatus - The new status to set for the booking
 * @returns Promise with the updated booking data
 */
export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus
): Promise<Booking> => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
    const response: AxiosResponse<{ booking: Booking }> =
      await axiosInstance.patch(
        `/bookings/${bookingId}/status`,
        {
          status: newStatus,
        },
        { headers }
      );

    return response.data.booking;
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw error;
  }
};
