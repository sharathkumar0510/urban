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

  // Get query parameters
  const searchParams = req.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const unreadOnly = searchParams.get("unread") === "true";

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data: notifications, error, count } = await query;

  if (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get unread count
  const { count: unreadCount, error: countError } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (countError) {
    console.error("Error counting unread notifications:", countError);
  }

  return NextResponse.json({
    notifications,
    count,
    unreadCount: unreadCount || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
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
  if (!body.title || !body.message || !body.type) {
    return NextResponse.json(
      { error: "Title, message, and type are required" },
      { status: 400 },
    );
  }

  // Create the notification
  const { data: notification, error } = await supabase
    .from("notifications")
    .insert({
      user_id: body.userId || user.id,
      title: body.title,
      message: body.message,
      type: body.type,
      related_id: body.relatedId,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notification });
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
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

  if (!body.id) {
    return NextResponse.json(
      { error: "Notification ID is required" },
      { status: 400 },
    );
  }

  // Check if the notification exists and belongs to the user
  const { data: existingNotification, error: checkError } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", body.id)
    .eq("user_id", user.id)
    .single();

  if (checkError) {
    return NextResponse.json(
      { error: "Notification not found or doesn't belong to you" },
      { status: 404 },
    );
  }

  // Update the notification
  const { data: notification, error } = await supabase
    .from("notifications")
    .update({
      is_read:
        body.isRead !== undefined ? body.isRead : existingNotification.is_read,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notification });
});
