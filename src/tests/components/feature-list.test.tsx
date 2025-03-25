/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FeatureList from "@/modules/services/components/feature-list";

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
        title: "Vetted Professionals",
        description:
          "All service providers undergo thorough background checks and skill verification",
        icon: "CheckCircle2",
        display_order: 1,
        is_active: true,
      },
      {
        id: "2",
        title: "Quality Guarantee",
        description:
          "If you're not satisfied with the service, we'll make it right or refund your money",
        icon: "Shield",
        display_order: 2,
        is_active: true,
      },
      {
        id: "3",
        title: "Secure Payments",
        description:
          "Your payment information is encrypted and never stored on our servers",
        icon: "CreditCard",
        display_order: 3,
        is_active: true,
      },
    ],
    error: null,
  })),
}));

describe("FeatureList Component", () => {
  it("renders loading state initially", () => {
    render(<FeatureList />);

    // Check for loading skeleton
    const skeletons = screen.getAllByClassName("animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders features after loading", async () => {
    render(<FeatureList />);

    await waitFor(() => {
      expect(screen.queryByClassName("animate-pulse")).not.toBeInTheDocument();
    });

    // Check for feature content
    expect(screen.getByText("Vetted Professionals")).toBeInTheDocument();
    expect(screen.getByText("Quality Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Secure Payments")).toBeInTheDocument();

    // Check for descriptions
    expect(
      screen.getByText(
        "All service providers undergo thorough background checks and skill verification",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "If you're not satisfied with the service, we'll make it right or refund your money",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your payment information is encrypted and never stored on our servers",
      ),
    ).toBeInTheDocument();
  });
});
