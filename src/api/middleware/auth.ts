import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Middleware to check if the user is authenticated
 */
export async function withAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Add user to the request object
      const requestWithUser = Object.assign(req, { user });

      return handler(requestWithUser, ...args);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
