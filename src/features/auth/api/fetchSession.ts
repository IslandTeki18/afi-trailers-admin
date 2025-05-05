import { User } from "../types/auth.types";
import { axiosInstance } from "../../../libs/axios";

export const fetchSession = async (): Promise<User> => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    // Set token in headers if it exists
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    const response = await axiosInstance.get<User>("/v1/users/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Session fetch error:", error);
    throw error;
  }
};
