import { axiosInstance } from "../../../libs/axios";

export const deleteTrailer = async (trailerId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
    await axiosInstance.delete(`/trailers/${trailerId}`, {
      headers,
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete trailer"
    );
  }
};
