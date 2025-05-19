import { axiosInstance } from "@/libs/axios";
import { Customer } from "../types/customer.types";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
    const response = await axiosInstance.get("/customers/", {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
