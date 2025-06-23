import { axiosInstance } from "../../../libs/axios";
import { TimeBlock } from "../types/booking.types";

export const createTimeBlock = async (
  timeBlockData: TimeBlock
): Promise<TimeBlock> => {
  try {
    const formattedData = {
      ...timeBlockData,
      startDate:
        timeBlockData.startDate instanceof Date
          ? timeBlockData.startDate.toISOString()
          : timeBlockData.startDate,
      endDate:
        timeBlockData.endDate instanceof Date
          ? timeBlockData.endDate.toISOString()
          : timeBlockData.endDate,
    };

    if (timeBlockData._id) {
      // Update existing time block
      const response = await axiosInstance.put(
        `/time-blocks/${timeBlockData._id}`,
        formattedData
      );
      return response.data;
    } else {
      const token = localStorage.getItem("atr_auth_token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
      };
      const response = await axiosInstance.post("/time-blocks", formattedData, {
        headers,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error creating/updating time block:", error);
    throw error;
  }
};
