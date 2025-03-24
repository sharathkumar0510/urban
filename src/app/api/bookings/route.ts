import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This is a placeholder for future database integration
    // In a real app, you would fetch bookings from your database
    const bookings = [
      {
        id: "booking-1",
        service: "Cleaning",
        date: "2023-06-15T10:00:00Z",
        status: "completed",
        price: 95,
      },
      {
        id: "booking-2",
        service: "Plumbing",
        date: "2023-07-20T14:30:00Z",
        status: "completed",
        price: 120,
      },
      {
        id: "booking-3",
        service: "Electrical",
        date: "2023-08-05T09:00:00Z",
        status: "upcoming",
        price: 150,
      },
    ];

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, date, time, address } = await request.json();

    // Validate required fields
    if (!serviceId || !date || !time || !address) {
      return NextResponse.json(
        { error: "Missing required booking information" },
        { status: 400 },
      );
    }

    // This is a placeholder for future database integration
    // In a real app, you would create a booking in your database
    const booking = {
      id: `booking-${Date.now()}`,
      userId: user.id,
      serviceId,
      date,
      time,
      address,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ booking, success: true });
  } catch (error) {
    console.error("Create booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
