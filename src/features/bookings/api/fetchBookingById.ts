import { axiosInstance } from "../../../libs/axios";
import { Booking } from "../types/booking.types";

/**
 * Fetches a single booking by its ID
 *
 * @param id - The ID of the booking to fetch
 * @returns Promise with the booking data
 * @throws Error if booking not found or other API error
 */
export const fetchBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Determines if a bookingId is valid format
 * (basic validation to prevent unnecessary API calls)
 *
 * @param id - The booking ID to validate
 * @returns boolean indicating if ID appears to be valid
 */
export const isValidBookingId = (id: string): boolean => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

export default fetchBookingById;
