import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withErrorHandling } from "@/api/middleware/error-handling";

export const GET = withErrorHandling(async (req: NextRequest) => {
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

  if (cartError && cartError.code !== "PGRST116") {
    console.error("Error fetching cart:", cartError);
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  }

  let cartId;

  // If cart doesn't exist, create one
  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) {
      console.error("Error creating cart:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    cartId = newCart.id;
  } else {
    cartId = cart.id;
  }

  // Get cart items with service details
  const { data: cartItems, error: itemsError } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      service:services(id, name, image_url, duration, vendor:vendor_profiles(business_name))
    `,
    )
    .eq("cart_id", cartId);

  if (itemsError) {
    console.error("Error fetching cart items:", itemsError);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // Transform the data to match the expected format
  const transformedItems = cartItems.map((item) => ({
    id: item.id,
    serviceId: item.service_id,
    price: item.price,
    quantity: item.quantity,
    scheduledDate: item.scheduled_date,
    scheduledTime: item.scheduled_time,
    service: {
      name: item.service?.name,
      image: item.service?.image_url,
      duration: item.service?.duration,
      vendor: {
        name: item.service?.vendor?.business_name,
      },
    },
  }));

  return NextResponse.json({ items: transformedItems });
});

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

  // Validate required fields
  if (!body.serviceId || !body.price) {
    return NextResponse.json(
      { error: "Service ID and price are required" },
      { status: 400 },
    );
  }

  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let cartId;

  // If cart doesn't exist, create one
  if (cartError && cartError.code === "PGRST116") {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) {
      console.error("Error creating cart:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    cartId = newCart.id;
  } else if (cartError) {
    console.error("Error fetching cart:", cartError);
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  } else {
    cartId = cart.id;
  }

  // Check if the service already exists in the cart
  const { data: existingItem, error: existingError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("service_id", body.serviceId)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    console.error("Error checking existing item:", existingError);
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingItem) {
    // Update the quantity of the existing item
    const newQuantity = (existingItem.quantity || 1) + (body.quantity || 1);
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
        scheduled_date: body.scheduledDate || existingItem.scheduled_date,
        scheduled_time: body.scheduledTime || existingItem.scheduled_time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
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
  } else {
    // Add a new item to the cart
    const { data: newItem, error: insertError } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        service_id: body.serviceId,
        price: body.price,
        quantity: body.quantity || 1,
        scheduled_date: body.scheduledDate,
        scheduled_time: body.scheduledTime,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error adding item to cart:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      item: {
        id: newItem.id,
        serviceId: newItem.service_id,
        price: newItem.price,
        quantity: newItem.quantity,
        scheduledDate: newItem.scheduled_date,
        scheduledTime: newItem.scheduled_time,
      },
    });
  }
});
