import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (cartError) {
    // If the cart doesn't exist, there's nothing to clear
    if (cartError.code === "PGRST116") {
      return NextResponse.json({ success: true });
    }

    console.error("Error fetching cart:", cartError);
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  }

  // Delete all items from the cart
  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (deleteError) {
    console.error("Error clearing cart:", deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
});
