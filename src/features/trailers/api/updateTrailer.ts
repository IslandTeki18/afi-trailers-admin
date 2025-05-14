import { AxiosError } from "axios";
import { axiosInstance } from "../../../libs/axios";
import { Trailer } from "../types/trailer.types";

interface UpdateTrailerResponse {
  success: boolean;
  trailer: Trailer;
  message?: string;
}

/**
 * Updates an existing trailer in the system
 * @param trailerId - The ID of the trailer to update
 * @param trailerData - The updated trailer data
 * @returns Promise with the updated trailer data
 */
export const updateTrailer = async (
  trailerId: string,
  trailerData: Trailer
): Promise<UpdateTrailerResponse> => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
    const response = await axiosInstance.put(
      `/trailers/${trailerId}`,
      trailerData,
      { headers }
    );

    return {
      success: true,
      trailer: response.data.trailer,
      message: "Trailer updated successfully",
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unknown error occurred while updating the trailer";

    console.log("Error updating trailer:", errorMessage);

    return {
      success: false,
      trailer: trailerData as Trailer,
      message: errorMessage,
    };
  }
};
