import { User } from "../types/auth.types";

export const fetchSession = async (): Promise<User> => {
  const token = localStorage.getItem("auth_token");

  try {
    const response = await fetch(
      `${process.env.REACT_ENV_API_URL}/api/v1/users/session`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Session invalid or expired");
    }

    return await response.json();
  } catch (error) {
    console.error("Session fetch error:", error);
    throw error;
  }
};
