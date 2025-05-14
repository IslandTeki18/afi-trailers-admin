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
    const response = await axiosInstance.post<{ token: string; user: User }>(
      "/users/login",
      credentials
    );

    if (response.data.token) {
      localStorage.setItem("atr_auth_token", response.data.token);
      const userData = response.data.user;
      localStorage.setItem("atr_admin_user", JSON.stringify(userData));
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return userData;
    }

    throw new Error("No user data returned from login");
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};
