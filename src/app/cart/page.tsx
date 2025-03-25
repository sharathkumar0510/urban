"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, CartSummary } from "@/features/cart";
import { useCart } from "@/features/cart/hooks/useCart";
import { ROUTES } from "@/constants/routes";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    loading,
    error,
    updateItem,
    removeItem,
    cartTotal,
    refresh,
  } = useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    await updateItem(id, { quantity });
  };

  const handleUpdateSchedule = async (
    id: string,
    date: string,
    time: string,
  ) => {
    await updateItem(id, { scheduledDate: date, scheduledTime: time });
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const handleCheckout = async (checkoutData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    specialInstructions?: string;
  }) => {
    try {
      setCheckoutError(null);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data.error || "Failed to complete checkout");
        return false;
      }

      if (data.errors && data.errors.length > 0) {
        setCheckoutError(
          `Some items could not be booked: ${data.errors.join(", ")}`,
        );
      }

      // Refresh cart after successful checkout
      refresh();
      return data.success;
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
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
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading your cart: {error.message}</p>
          <Button variant="outline" className="mt-2" onClick={() => refresh()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{checkoutError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Looks like you haven't added any services to your cart yet.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push(ROUTES.SERVICES)}>
                  Browse Services
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Cart Items
              </h2>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onUpdateSchedule={handleUpdateSchedule}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            items={cartItems}
            total={cartTotal}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
