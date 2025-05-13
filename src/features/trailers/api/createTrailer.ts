import { axiosInstance } from "@/libs/axios";
import { Trailer } from "../types/trailer.types";

export const createTrailer = async (trailer: Trailer) => {
  try {
    const token = localStorage.getItem("atr_auth_token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    const response = await axiosInstance.post("/trailers", trailer, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error creating trailer:", error);
    throw error;
  }
};
