import { axiosInstance } from "../../../libs/axios";
import { Booking } from "../types/booking.types";

export interface CreateBookingPayload {
  customerId: string;
  trailerId: string;
  startDate: Date | string;
  endDate: Date | string;
  serviceType: "full" | "self";
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  specialRequests?: string;
  insurancePurchased?: boolean;
  additionalEquipment?: Array<{
    item: string;
    quantity: number;
    cost: number;
  }>;
  totalAmount: number;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

/**
 * Creates a new booking in the system
 *
 * @param bookingData - The booking information to create
 * @returns Promise with the created booking data
 */
export const createBooking = async (
  bookingData: CreateBookingPayload
): Promise<Booking> => {
  try {
    // Ensure dates are in ISO format for the API
    const formattedData = {
      ...bookingData,
      startDate:
        bookingData.startDate instanceof Date
          ? bookingData.startDate.toISOString()
          : bookingData.startDate,
      endDate:
        bookingData.endDate instanceof Date
          ? bookingData.endDate.toISOString()
          : bookingData.endDate,
    };

    // Do not send any _id field - MongoDB will generate this automatically
    if ("_id" in formattedData) {
      delete formattedData._id;
    }

    const response = await axiosInstance.post("/bookings", formattedData);

    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Helper function to validate booking data before sending to API
 *
 * @param bookingData - The booking data to validate
 * @returns Object with isValid flag and any error messages
 */
export const validateBookingData = (
  bookingData: Partial<CreateBookingPayload>
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!bookingData.customerId) {
    errors.customerId = "Customer is required";
  }

  if (!bookingData.trailerId) {
    errors.trailerId = "Trailer is required";
  }

  if (!bookingData.startDate) {
    errors.startDate = "Pick-up date is required";
  }

  if (!bookingData.endDate) {
    errors.endDate = "Last day of use is required";
  }

  if (bookingData.startDate && bookingData.endDate) {
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);

    if (start > end) {
      errors.endDate = "Last day of use cannot be before pick-up date";
    }
  }

  if (!bookingData.serviceType) {
    errors.serviceType = "Service type is required";
  }

  if (bookingData.totalAmount === undefined) {
    errors.totalAmount = "Total cost is required";
  }

  // If service type is 'full', require delivery address
  if (bookingData.serviceType === "full" && !bookingData.deliveryAddress) {
    errors.deliveryAddress = "Delivery address is required for full service";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default createBooking;
