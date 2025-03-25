/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/services/route";

// Mock the createClient function
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    data: [
      {
        id: "1",
        name: "House Cleaning",
        description: "Professional house cleaning service",
        starting_price: 89,
        image_url: "https://example.com/house-cleaning.jpg",
        avg_rating: 4.5,
        total_reviews: 120,
        subcategory: {
          id: "101",
          name: "House Cleaning",
          slug: "house-cleaning",
          category: {
            id: "1",
            name: "Cleaning",
            slug: "cleaning",
          },
        },
        vendor: {
          id: "v1",
          business_name: "CleanCo",
          business_logo: "https://example.com/cleanco-logo.jpg",
          avg_rating: 4.7,
          total_reviews: 350,
        },
        service_features: [
          { name: "Deep Cleaning" },
          { name: "Eco-Friendly Products" },
        ],
        service_locations: [{ city: "San Francisco", state: "CA" }],
        service_images: [
          { image_url: "https://example.com/house-cleaning-1.jpg" },
          { image_url: "https://example.com/house-cleaning-2.jpg" },
        ],
        is_featured: true,
      },
    ],
    error: null,
    count: 1,
  })),
}));

// Mock the withErrorHandling function
jest.mock("@/api/middleware/error-handling", () => ({
  withErrorHandling: (handler: any) => handler,
}));

describe("Services API", () => {
  it("should return transformed services data", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/services?category=cleaning",
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("services");
    expect(data.services).toBeInstanceOf(Array);
    expect(data.services.length).toBe(1);

    const service = data.services[0];
    expect(service).toHaveProperty("id", "1");
    expect(service).toHaveProperty("name", "House Cleaning");
    expect(service).toHaveProperty("startingPrice", 89);
    expect(service).toHaveProperty("category", "Cleaning");
    expect(service).toHaveProperty("subcategory", "House Cleaning");
    expect(service).toHaveProperty("features");
    expect(service.features).toBeInstanceOf(Array);
    expect(service.features.length).toBe(2);
    expect(service.features).toContain("Deep Cleaning");

    expect(service).toHaveProperty("vendor");
    expect(service.vendor).toHaveProperty("name", "CleanCo");
    expect(service.vendor).toHaveProperty("rating", 4.7);

    expect(service).toHaveProperty("images");
    expect(service.images).toBeInstanceOf(Array);
    expect(service.images.length).toBe(2);

    expect(service).toHaveProperty("isFeatured", true);
  });
});
