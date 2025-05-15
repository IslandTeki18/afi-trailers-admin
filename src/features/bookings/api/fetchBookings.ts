import { axiosInstance } from "../../../libs/axios";
import { Booking } from "../types/booking.types";

interface FetchBookingsOptions {
  page?: number;
  limit?: number;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  customerId?: string;
  trailerId?: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

interface BookingsPaginatedResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches a list of bookings with optional filtering and pagination
 *
 * @param options - Query parameters for filtering and pagination
 * @returns Promise with paginated bookings data
 */
export const fetchBookings = async (
  options: FetchBookingsOptions = {}
): Promise<BookingsPaginatedResponse> => {
  try {
    const formattedOptions = {
      ...options,
      startDate:
        options.startDate instanceof Date
          ? options.startDate.toISOString()
          : options.startDate,
      endDate:
        options.endDate instanceof Date
          ? options.endDate.toISOString()
          : options.endDate,
    };

    const queryParams = Object.entries(formattedOptions)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const response = await axiosInstance.get("/bookings", {
      params: queryParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export default fetchBookings;
