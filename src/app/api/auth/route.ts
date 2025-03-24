import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    const supabase = await createClient();

    switch (action) {
      case "login": {
        const { email, password } = data;
        const { data: authData, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ user: authData.user });
      }

      case "register": {
        const { email, password, fullName } = data;
        const origin = request.headers.get("origin") || "";

        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              full_name: fullName,
              email,
            },
          },
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Create user profile
        if (authData.user) {
          try {
            const { error: profileError } = await supabase
              .from("users")
              .insert({
                id: authData.user.id,
                name: fullName,
                full_name: fullName,
                email,
                user_id: authData.user.id,
                token_identifier: authData.user.id,
                created_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error("Error creating user profile:", profileError);
            }
          } catch (err) {
            console.error("Error in user profile creation:", err);
          }
        }

        return NextResponse.json({ user: authData.user });
      }

      case "logout": {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
      }

      case "reset-password": {
        const { email } = data;
        const origin = request.headers.get("origin") || "";

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
      }

      case "update-password": {
        const { password } = data;

        const { error } = await supabase.auth.updateUser({
          password,
        });

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
