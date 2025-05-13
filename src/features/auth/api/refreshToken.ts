import { axiosInstance } from "../../../libs/axios";

interface RefreshResponse {
  token: string;
}

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post<RefreshResponse>(
      "/users/refresh-token"
    );

    const newToken = response.data.token;

    // Update token in localStorage
    localStorage.setItem("auth_token", newToken);

    // Update axios default headers
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newToken}`;

    return newToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    localStorage.removeItem("auth_token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    throw error;
  }
};
