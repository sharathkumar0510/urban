import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    // This is a placeholder for future database integration
    // In a real app, you would fetch services from your database
    const services = [
      {
        id: "cleaning",
        name: "Cleaning",
        description: "Professional home cleaning services",
        startingPrice: 89,
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        locations: ["San Francisco, CA", "Oakland, CA", "San Jose, CA"],
      },
      {
        id: "plumbing",
        name: "Plumbing",
        description: "Expert plumbing repair and installation",
        startingPrice: 85,
        image:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        locations: ["San Francisco, CA", "Oakland, CA", "Palo Alto, CA"],
      },
      {
        id: "electrical",
        name: "Electrical",
        description: "Electrical repairs and installations",
        startingPrice: 95,
        image:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
        locations: ["San Francisco, CA", "San Jose, CA", "Mountain View, CA"],
      },
      {
        id: "landscaping",
        name: "Landscaping",
        description: "Professional landscaping and garden maintenance",
        startingPrice: 120,
        image:
          "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
        locations: ["San Francisco, CA", "Palo Alto, CA", "Menlo Park, CA"],
      },
      {
        id: "security",
        name: "Security",
        description: "Home security system installation and monitoring",
        startingPrice: 150,
        image:
          "https://images.unsplash.com/photo-1558002038-1055e2dae1d7?w=800&q=80",
        locations: ["San Francisco, CA", "Oakland, CA", "Berkeley, CA"],
      },
      {
        id: "hvac",
        name: "HVAC",
        description: "Heating, ventilation, and air conditioning services",
        startingPrice: 110,
        image:
          "https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80",
        locations: ["San Francisco, CA", "San Jose, CA", "Sunnyvale, CA"],
      },
    ];

    let filteredServices = services;

    // Filter by category if provided
    if (category) {
      filteredServices = filteredServices.filter(
        (service) => service.id === category,
      );
    }

    // Filter by location if provided
    if (location) {
      filteredServices = filteredServices.filter((service) =>
        service.locations.includes(location),
      );
    }

    return NextResponse.json({ services: filteredServices });
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
