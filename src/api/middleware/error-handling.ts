import { NextResponse } from "next/server";

/**
 * Wraps an API route handler with error handling
 */
export function withErrorHandling(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error("API error:", error);

      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
