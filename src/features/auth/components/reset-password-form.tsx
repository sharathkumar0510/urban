"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const { updatePassword, loading: isLoading, error } = useAuth();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    const success = await updatePassword(password);

    if (success) {
      setMessage({ type: "success", text: "Password updated successfully" });
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push(ROUTES.AUTH.SIGN_IN);
      }, 2000);
    } else if (error) {
      setMessage({ type: "error", text: error });
    }
  }

  return (
    <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            New password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="New password"
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            className="w-full"
          />
        </div>
      </div>

      <SubmitButton
        pendingText="Resetting password..."
        className="w-full"
        disabled={isLoading}
      >
        Reset password
      </SubmitButton>

      {message && (
        <div
          className={`${message.type === "error" ? "text-red-500" : "text-green-500"} text-sm border-l-2 ${message.type === "error" ? "border-red-500" : "border-green-500"} pl-2`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
