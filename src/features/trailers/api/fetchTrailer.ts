import { Trailer } from "../types/trailer.types";
import { axiosInstance } from "../../../libs/axios";

/**
 * Fetches a single trailer by its ID
 * @param id The ID of the trailer to fetch
 * @returns Promise with the trailer data
 */
export const fetchTrailer = async (id: string): Promise<Trailer> => {
  try {
    const response = await axiosInstance.get(`/trailers/${id}`);

    return response.data.trailer;
  } catch (error) {
    console.error(`Failed to fetch trailer with ID ${id}:`, error);
    throw error;
  }
};
