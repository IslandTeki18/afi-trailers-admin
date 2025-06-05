import { axiosInstance } from "../../../libs/axios";
import { TimeBlock } from "../types/booking.types";

export const fetchTimeBlocks = async (): Promise<TimeBlock[]> => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };
    const response = await axiosInstance.get("/time-blocks", { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching time blocks:", error);
    throw error;
  }
};
