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
      // Create new time block
      const response = await axiosInstance.post("/time-blocks", formattedData);
      return response.data;
    }
  } catch (error) {
    console.error("Error creating/updating time block:", error);
    throw error;
  }
};
