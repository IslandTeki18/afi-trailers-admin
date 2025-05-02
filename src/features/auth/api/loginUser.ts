import { User } from "../types/auth.types";

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
    const response = await fetch(
      `${process.env.REACT_ENV_API_URL}/api/v1/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const userData: User = await response.json();

    // Store token in localStorage or secure cookie if needed
    if (userData.token) {
      localStorage.setItem("auth_token", userData.token);
    }

    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
