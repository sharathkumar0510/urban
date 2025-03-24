export async function fetchUserProfile() {
  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userData: Record<string, any>) {
  try {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
