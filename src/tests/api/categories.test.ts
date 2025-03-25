/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/categories/route";

// Mock the createClient function
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    data: [
      {
        id: "1",
        name: "Cleaning",
        description: "Professional cleaning services",
        icon: "🧹",
        image_url: "https://example.com/cleaning.jpg",
        slug: "cleaning",
        display_order: 1,
        is_active: true,
        service_count: 10,
        subcategories: [
          {
            id: "101",
            name: "House Cleaning",
            slug: "house-cleaning",
            service_count: 5,
          },
          {
            id: "102",
            name: "Office Cleaning",
            slug: "office-cleaning",
            service_count: 5,
          },
        ],
      },
    ],
    error: null,
  })),
}));

// Mock the withErrorHandling function
jest.mock("@/api/middleware/error-handling", () => ({
  withErrorHandling: (handler: any) => handler,
}));

describe("Categories API", () => {
  it("should return transformed categories data", async () => {
    const req = new NextRequest("http://localhost:3000/api/categories");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("categories");
    expect(data.categories).toBeInstanceOf(Array);
    expect(data.categories.length).toBe(1);

    const category = data.categories[0];
    expect(category).toHaveProperty("id", "1");
    expect(category).toHaveProperty("name", "Cleaning");
    expect(category).toHaveProperty("slug", "cleaning");
    expect(category).toHaveProperty("subcategories");
    expect(category.subcategories).toBeInstanceOf(Array);
    expect(category.subcategories.length).toBe(2);

    const subcategory = category.subcategories[0];
    expect(subcategory).toHaveProperty("id", "101");
    expect(subcategory).toHaveProperty("name", "House Cleaning");
    expect(subcategory).toHaveProperty("slug", "house-cleaning");
    expect(subcategory).toHaveProperty("count", 5);
  });
});
