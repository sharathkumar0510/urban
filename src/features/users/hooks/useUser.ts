import { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../api/usersApi";
import { User } from "@/types/models/User";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const { profile } = await fetchUserProfile();
        setUser(profile);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const { profile } = await updateUserProfile(userData);
      setUser(profile);
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, updateUser };
}
