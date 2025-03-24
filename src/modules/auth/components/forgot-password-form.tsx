"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function ForgotPasswordForm() {
  const { requestPasswordReset, loading: isLoading, error } = useAuth();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    const success = await requestPasswordReset(email);

    if (success) {
      setMessage({
        type: "success",
        text: "Check your email for a link to reset your password.",
      });
    } else if (error) {
      setMessage({ type: "error", text: error });
    }
  }

  return (
    <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline transition-all"
            href={ROUTES.AUTH.SIGN_IN}
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full"
          />
        </div>
      </div>

      <SubmitButton
        pendingText="Sending reset link..."
        className="w-full"
        disabled={isLoading}
      >
        Reset Password
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
