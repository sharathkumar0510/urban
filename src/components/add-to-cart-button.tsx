"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/useCart";
import { ROUTES } from "@/constants/routes";

interface AddToCartButtonProps {
  serviceId: string;
  price: number;
  className?: string;
  showViewCart?: boolean;
}

export function AddToCartButton({
  serviceId,
  price,
  className = "",
  showViewCart = true,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const success = await addItem({
        serviceId,
        price,
        quantity: 1,
      });

      if (success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        setError("Failed to add to cart");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={loading || added}
          className={`flex-1 flex items-center gap-2 ${added ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : loading ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>

        {showViewCart && added && (
          <Button variant="outline" onClick={() => router.push(ROUTES.BOOKING)}>
            View Cart
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
