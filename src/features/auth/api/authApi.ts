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
      // First check if user already exists to avoid duplicate key errors
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows returned
        console.error("Error checking for existing user:", checkError);
      }

      // Only insert if user doesn't exist
      if (!existingUser) {
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
      }

      // Also create or update the profile in the profiles table
      const { error: profilesError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: userData.fullName,
          email: userData.email,
          role: "customer", // Default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (profilesError) {
        console.error("Error creating/updating profile:", profilesError);
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
