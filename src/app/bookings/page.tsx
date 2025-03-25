"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { ROUTES } from "@/constants/routes";

export default function BookingsPage() {
  const router = useRouter();
  const { bookings, loading, error } = useBookings();
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return ["pending", "confirmed", "upcoming", "in_progress"].includes(
        booking.status,
      );
    } else if (activeTab === "completed") {
      return booking.status === "completed";
    } else {
      return booking.status === "cancelled";
    }
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-purple-100 text-purple-800";
      case "in_progress":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-36 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading your bookings. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "upcoming" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "completed" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "cancelled" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Cancelled
          </button>
        </nav>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          {activeTab === "upcoming" ? (
            <>
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No upcoming bookings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any upcoming service bookings.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push(ROUTES.SERVICES)}>
                  Book a Service
                </Button>
              </div>
            </>
          ) : activeTab === "completed" ? (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No completed bookings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any completed service bookings yet.
              </p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No cancelled bookings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any cancelled service bookings.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.service}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(booking.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {booking.time && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.time}</span>
                    </div>
                  )}

                  {booking.address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{booking.address}</span>
                    </div>
                  )}
                </div>

                {booking.price && (
                  <div className="mt-4 text-lg font-medium text-gray-900">
                    ${booking.price.toFixed(2)}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>

                  {(booking.status === "pending" ||
                    booking.status === "confirmed" ||
                    booking.status === "upcoming") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
