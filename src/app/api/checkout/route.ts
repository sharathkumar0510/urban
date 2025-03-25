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

  // Parse the request body
  const body = await req.json();
  const { address, city, state, zipCode, specialInstructions } = body;

  // Validate required fields
  if (!address || !city || !state || !zipCode) {
    return NextResponse.json(
      { error: "Address information is required" },
      { status: 400 },
    );
  }

  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (cartError) {
    console.error("Error fetching cart:", cartError);
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  // Get cart items with service details
  const { data: cartItems, error: itemsError } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      service:services(id, name, vendor_id, duration, starting_price)
    `,
    )
    .eq("cart_id", cart.id);

  if (itemsError) {
    console.error("Error fetching cart items:", itemsError);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Create bookings for each cart item
  const bookings = [];
  const bookingErrors = [];

  for (const item of cartItems) {
    if (!item.service) {
      bookingErrors.push(`Service not found for cart item ${item.id}`);
      continue;
    }

    try {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          service_id: item.service_id,
          vendor_id: item.service.vendor_id,
          scheduled_date:
            item.scheduled_date || new Date().toISOString().split("T")[0],
          scheduled_time: item.scheduled_time || "09:00:00",
          duration: item.service.duration || 60,
          price: item.price || item.service.starting_price,
          address,
          city,
          state,
          zip_code: zipCode,
          special_instructions: specialInstructions,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        bookingErrors.push(
          `Failed to create booking for ${item.service.name}: ${bookingError.message}`,
        );
      } else {
        bookings.push(booking);
      }
    } catch (error) {
      console.error("Exception creating booking:", error);
      bookingErrors.push(`Exception creating booking for ${item.service.name}`);
    }
  }

  // Clear the cart after successful checkout
  if (bookings.length > 0) {
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    if (deleteError) {
      console.error("Error clearing cart after checkout:", deleteError);
    }
  }

  // Create a notification for the user
  if (bookings.length > 0) {
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title: "Booking Confirmation",
        message: `Your booking${bookings.length > 1 ? "s have" : " has"} been confirmed. Check your dashboard for details.`,
        type: "booking_confirmation",
        related_id: bookings[0].id,
        is_read: false,
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
    }
  }

  return NextResponse.json({
    success: bookings.length > 0,
    bookings,
    errors: bookingErrors,
  });
});
