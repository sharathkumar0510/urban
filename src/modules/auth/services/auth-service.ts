import { createClient } from "@/lib/supabase/client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

// Client-side authentication service
export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

export async function registerUser(
  userData: RegisterData,
): Promise<AuthResult> {
  const supabase = createClient();

  // Get the origin for the redirect URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: userData.fullName,
        email: userData.email,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Create user profile in the users table
  if (data.user) {
    try {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        name: userData.fullName,
        full_name: userData.fullName,
        email: userData.email,
        user_id: data.user.id,
        token_identifier: data.user.id,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // We don't return an error here as the auth account was created successfully
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return { success: true, user: data.user };
}

export async function forgotPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  // Get the origin for the redirect URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function resetPassword(password: string): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
