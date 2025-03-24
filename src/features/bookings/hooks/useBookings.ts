import { useState, useEffect } from "react";
import { fetchUserBookings } from "../api/bookingsApi";
import { Booking } from "@/types/models/Booking";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const { bookings } = await fetchUserBookings();
        setBookings(bookings);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return { bookings, loading, error };
}
