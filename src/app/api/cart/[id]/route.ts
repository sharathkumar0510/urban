import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const supabase = await createClient();
    const itemId = params.id;

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();

    // Get the user's cart
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (cartError) {
      console.error("Error fetching cart:", cartError);
      return NextResponse.json({ error: cartError.message }, { status: 500 });
    }

    // Check if the item exists and belongs to the user's cart
    const { data: existingItem, error: existingError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", itemId)
      .eq("cart_id", cart.id)
      .single();

    if (existingError) {
      console.error("Error checking cart item:", existingError);
      return NextResponse.json(
        { error: "Item not found or doesn't belong to your cart" },
        { status: 404 },
      );
    }

    // Update the cart item
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity:
          body.quantity !== undefined ? body.quantity : existingItem.quantity,
        scheduled_date:
          body.scheduledDate !== undefined
            ? body.scheduledDate
            : existingItem.scheduled_date,
        scheduled_time:
          body.scheduledTime !== undefined
            ? body.scheduledTime
            : existingItem.scheduled_time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      item: {
        id: updatedItem.id,
        serviceId: updatedItem.service_id,
        price: updatedItem.price,
        quantity: updatedItem.quantity,
        scheduledDate: updatedItem.scheduled_date,
        scheduledTime: updatedItem.scheduled_time,
      },
    });
  },
);

export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const supabase = await createClient();
    const itemId = params.id;

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
      console.error("Error fetching cart:", cartError);
      return NextResponse.json({ error: cartError.message }, { status: 500 });
    }

    // Check if the item exists and belongs to the user's cart
    const { data: existingItem, error: existingError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("id", itemId)
      .eq("cart_id", cart.id)
      .single();

    if (existingError) {
      console.error("Error checking cart item:", existingError);
      return NextResponse.json(
        { error: "Item not found or doesn't belong to your cart" },
        { status: 404 },
      );
    }

    // Delete the cart item
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      console.error("Error deleting cart item:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  },
);
