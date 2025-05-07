import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_ENV_API_URL || "http://localhost:3001/api",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If error is 401 and not a retry request
    if (
      error.response?.status === 401 &&
      !originalRequest?.headers["X-Retry"]
    ) {
      try {
        // Try to refresh token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.token;

        // Update token in localStorage
        localStorage.setItem("auth_token", newToken);

        // Update header for original request and retry
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers["X-Retry"] = "true";
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
