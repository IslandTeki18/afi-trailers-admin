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
      "/v1/users/login",
      credentials
    );

    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);

      // Make sure we're returning the user object, not the whole response
      const userData = response.data.user;

      // Set the authorization header for future requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return userData;
    }

    throw new Error("No user data returned from login");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
