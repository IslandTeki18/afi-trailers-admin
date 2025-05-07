import { User } from "../types/auth.types";
import { axiosInstance } from "@/libs/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const credentials: LoginCredentials = {
    email,
    password,
  };

  try {
    const response = await axiosInstance.post<User>(
      "/v1/users/login",
      credentials
    );

    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("atr_admin_user", JSON.stringify(response.data.user));

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};
