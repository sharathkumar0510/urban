/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HeroCarousel from "@/modules/home/components/hero-carousel";

// Mock the createClient function
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    data: [
      {
        id: "1",
        title: "Get 20% Off Your First Cleaning",
        description: "Professional home cleaning services starting at just $89",
        image_url:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        cta_text: "Book Now",
        cta_link: "/services/cleaning",
        display_order: 1,
        is_active: true,
      },
      {
        id: "2",
        title: "Emergency Plumbing Services",
        description:
          "Available 24/7 - Qualified plumbers at your door in 60 minutes or less",
        image_url:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        cta_text: "Book Now",
        cta_link: "/services/plumbing",
        display_order: 2,
        is_active: true,
      },
    ],
    error: null,
  })),
}));

// Mock the Carousel component
jest.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children, setApi }: any) => {
    // Mock the API
    React.useEffect(() => {
      if (setApi) {
        setApi({
          scrollSnapList: () => [1, 2],
          selectedScrollSnap: () => 0,
          scrollNext: jest.fn(),
          scrollTo: jest.fn(),
          on: jest.fn((event, callback) => {
            if (event === "select") callback();
          }),
        });
      }
    }, [setApi]);
    return <div data-testid="carousel">{children}</div>;
  },
  CarouselContent: ({ children }: any) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: any) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselPrevious: () => (
    <button data-testid="carousel-previous">Previous</button>
  ),
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
}));

describe("HeroCarousel Component", () => {
  it("renders loading state initially", () => {
    render(<HeroCarousel />);
    expect(screen.getByText("Loading promotions...")).toBeInTheDocument();
  });

  it("renders promotional banners after loading", async () => {
    render(<HeroCarousel />);

    await waitFor(() => {
      expect(
        screen.queryByText("Loading promotions..."),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-content")).toBeInTheDocument();
    expect(screen.getAllByTestId("carousel-item").length).toBeGreaterThan(0);

    // Check for promotion content
    expect(
      screen.getByText("Get 20% Off Your First Cleaning"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Professional home cleaning services starting at just $89",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Emergency Plumbing Services")).toBeInTheDocument();

    // Check for navigation controls
    expect(screen.getByTestId("carousel-previous")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
  });
});
