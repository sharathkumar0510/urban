import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  signOut,
  getCurrentUser,
} from "../api/authApi";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await loginUser({ email, password });

      if (result.error) {
        setError(result.error);
        return false;
      }

      router.push(ROUTES.DASHBOARD);
      router.refresh();
      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await registerUser({ email, password, fullName });

      if (result.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await forgotPassword(email);

      if (result.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await resetPassword(password);

      if (result.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.refresh();
      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    requestPasswordReset,
    updatePassword,
    logout,
    loading,
    error,
  };
}
