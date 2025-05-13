import { Trailer } from "../types/trailer.types";
import { axiosInstance } from "../../../libs/axios";

export const fetchTrailers = async () => {
  try {
    // Make API request using axios instance
    const response = await axiosInstance.get("/trailers/");

    return response.data.trailers || [];
  } catch (error) {
    console.error("Failed to fetch trailers:", error);
    throw error;
  }
};
