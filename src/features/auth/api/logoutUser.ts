export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.REACT_ENV_API_URL}/api/v1/users/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }

    // Remove token from localStorage if you stored it there
    localStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
