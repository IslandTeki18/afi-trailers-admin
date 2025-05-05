import { axiosInstance } from "../../../libs/axios";

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/v1/users/logout");

    // Remove token from localStorage
    localStorage.removeItem("auth_token");

    // Remove Authorization header from axios instance
    delete axiosInstance.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
