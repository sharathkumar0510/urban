"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function LoginForm() {
  const router = useRouter();
  const { login, loading: isLoading, error } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await login(email, password);
  }

  return (
    <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline transition-all"
            href={ROUTES.AUTH.SIGN_UP}
          >
            Sign up
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
              href={ROUTES.AUTH.FORGOT_PASSWORD}
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            required
            className="w-full"
          />
        </div>
      </div>

      <SubmitButton
        className="w-full"
        pendingText="Signing in..."
        disabled={isLoading}
      >
        Sign in
      </SubmitButton>

      {error && (
        <div className="text-red-500 text-sm border-l-2 border-red-500 pl-2">
          {error}
        </div>
      )}
    </form>
  );
}
