import { User } from "../types/auth.types";
import { axiosInstance } from "../../../libs/axios";

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

    // Store token in localStorage if needed
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);

      // Add token to axios default headers for subsequent requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
