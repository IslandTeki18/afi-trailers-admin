import { axiosInstance } from "../../../libs/axios";

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/users/logout");

    // Remove token from localStorage
    localStorage.removeItem("auth_token");

    // Remove Authorization header from axios instance
    delete axiosInstance.defaults.headers.common["Authorization"];
  } catch (error) {
    console.log("Logout error:", error);
    throw error;
  }
};
