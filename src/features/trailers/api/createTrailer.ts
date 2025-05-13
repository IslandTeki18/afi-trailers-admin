import { axiosInstance } from "@/libs/axios";
import { Trailer } from "../types/trailer.types";

export const createTrailer = async (trailer: Trailer) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    // Set up headers with the token
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    // Make the request with explicit headers
    const response = await axiosInstance.post("/trailers/", trailer, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating trailer:", error);
    throw error;
  }
};
