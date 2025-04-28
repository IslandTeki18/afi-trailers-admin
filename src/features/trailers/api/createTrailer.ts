import { axiosInstance } from "@/libs/axios";
import { Trailer } from "../types/trailer.types";

export const createTrailer = async (trailer: Trailer) => {
  try {
    const response = await axiosInstance.post("/trailers", trailer);
    return response.data;
  } catch (error) {
    console.error("Error creating trailer:", error);
    throw error;
  }
};