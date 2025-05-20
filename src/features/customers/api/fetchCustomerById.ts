import { axiosInstance } from "@/libs/axios";
import { Customer } from "../types/customer.types";

/**
 * Fetches a specific customer by their ID
 *
 * @param customerId - The ID of the customer to fetch
 * @returns Promise with the customer data
 */
export const fetchCustomerById = async (
  customerId: string
): Promise<Customer> => {
  try {
    const response = await axiosInstance.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer with ID ${customerId}:`, error);
    throw error;
  }
};
