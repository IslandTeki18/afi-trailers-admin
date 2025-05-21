import { AxiosResponse } from "axios";
import { axiosInstance } from "../../../libs/axios";
import { Booking } from "../types/booking.types";

/**
 * Updates multiple fields of a booking including status if needed
 * 
 * @param bookingId - The ID of the booking to update
 * @param updateData - Object containing the fields to update
 * @returns Promise with the updated booking data
 */
export const updateBooking = async (
    bookingId: string, 
    updateData: Partial<Booking>
  ): Promise<Booking> => {
    try {
        const token = localStorage.getItem("atr_auth_token");
        const headers = {
          Authorization: token ? `Bearer ${token}` : "",
        };
      const response: AxiosResponse<{ booking: Booking }> = await axiosInstance.put(
        `/bookings/${bookingId}`,
        updateData,
        { headers }
      );
      
      return response.data.booking;
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  };
