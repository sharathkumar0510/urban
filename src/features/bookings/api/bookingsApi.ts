import { createClient } from "@/lib/supabase/client";

export async function fetchUserBookings() {
  try {
    const response = await fetch("/api/bookings");
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

export async function createBooking(bookingData: {
  serviceId: string;
  date: string;
  time: string;
  address: string;
}) {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}
