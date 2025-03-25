/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ServiceList from "@/modules/services/components/service-list";

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} src={props.src} alt={props.alt} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => {
    return <a href={href}>{children}</a>;
  },
}));

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
        name: "Cleaning",
        description: "Professional cleaning services for your home",
        icon: "🧹",
        image_url:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80",
        slug: "cleaning",
        is_active: true,
        display_order: 1,
      },
      {
        id: "2",
        name: "Plumbing",
        description: "Expert plumbing services for any issue",
        icon: "🔧",
        image_url:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80",
        slug: "plumbing",
        is_active: true,
        display_order: 2,
      },
      {
        id: "3",
        name: "Electrical",
        description: "Professional electrical services",
        icon: "⚡",
        image_url:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80",
        slug: "electrical",
        is_active: true,
        display_order: 3,
      },
    ],
    error: null,
  })),
}));

describe("ServiceList Component", () => {
  it("renders loading state initially", () => {
    render(<ServiceList />);

    // Check for loading skeleton
    const skeletons = screen.getAllByClassName("animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders service categories after loading", async () => {
    render(<ServiceList />);

    await waitFor(() => {
      expect(screen.queryByClassName("animate-pulse")).not.toBeInTheDocument();
    });

    // Check for category heading
    expect(screen.getByText("What are you looking for?")).toBeInTheDocument();

    // Check for service categories
    expect(screen.getByText("Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();

    // Check for links
    const cleaningLink = screen.getByRole("link", { name: /Cleaning/i });
    expect(cleaningLink).toHaveAttribute("href", "/services/cleaning");

    const plumbingLink = screen.getByRole("link", { name: /Plumbing/i });
    expect(plumbingLink).toHaveAttribute("href", "/services/plumbing");

    const electricalLink = screen.getByRole("link", { name: /Electrical/i });
    expect(electricalLink).toHaveAttribute("href", "/services/electrical");
  });
});
