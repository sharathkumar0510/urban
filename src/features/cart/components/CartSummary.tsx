"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem as CartItemType } from "../api/cartApi";
import { ROUTES } from "@/constants/routes";

interface CartSummaryProps {
  items: CartItemType[];
  total: number;
  onCheckout: (checkoutData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    specialInstructions?: string;
  }) => Promise<boolean>;
}

export function CartSummary({ items, total, onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!checkoutData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!checkoutData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!checkoutData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!checkoutData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(checkoutData.zipCode.trim())) {
      newErrors.zipCode = "Invalid ZIP code format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await onCheckout(checkoutData);
      if (success) {
        router.push(ROUTES.BOOKING);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Your cart is empty
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Start adding services to your cart
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push(ROUTES.SERVICES)}>
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 p-6">
      {!isCheckingOut ? (
        <>
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <p>
                Subtotal ({items.length} {items.length === 1 ? "item" : "items"}
                )
              </p>
              <p>${total.toFixed(2)}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <p>Service Fee</p>
              <p>${(total * 0.05).toFixed(2)}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <p>Tax</p>
              <p>${(total * 0.08).toFixed(2)}</p>
            </div>

            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
              <p>Total</p>
              <p>${(total + total * 0.05 + total * 0.08).toFixed(2)}</p>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => setIsCheckingOut(true)}
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-medium text-gray-900">Checkout</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={checkoutData.address}
                onChange={handleInputChange}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={checkoutData.city}
                  onChange={handleInputChange}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  value={checkoutData.state}
                  onChange={handleInputChange}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP Code
              </label>
              <Input
                id="zipCode"
                name="zipCode"
                value={checkoutData.zipCode}
                onChange={handleInputChange}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="specialInstructions"
                className="block text-sm font-medium text-gray-700"
              >
                Special Instructions (Optional)
              </label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={checkoutData.specialInstructions}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>${(total + total * 0.05 + total * 0.08).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCheckingOut(false)}
              disabled={isSubmitting}
            >
              Back
            </Button>

            <Button
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              <CreditCard className="h-4 w-4" />
              {isSubmitting ? "Processing..." : "Complete Order"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
