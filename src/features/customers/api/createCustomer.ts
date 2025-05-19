import { axiosInstance } from "@/libs/axios";
import { Customer } from "../types/customer.types";

export const createCustomer = async (customer: Customer) => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    const response = await axiosInstance.post("/customers", customer, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error creating customer:", error);
    throw error;
  }
};
