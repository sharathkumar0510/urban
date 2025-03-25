import { createClient } from "@/lib/supabase/client";

export interface CartItem {
  id: string;
  serviceId: string;
  price: number;
  quantity: number;
  scheduledDate?: string;
  scheduledTime?: string;
  service?: {
    name: string;
    image?: string;
    duration?: number;
    vendor?: {
      name?: string;
    };
  };
}

export async function fetchCart() {
  try {
    const response = await fetch("/api/cart");
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function addToCart(item: {
  serviceId: string;
  price: number;
  quantity?: number;
  scheduledDate?: string;
  scheduledTime?: string;
}) {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItem(
  itemId: string,
  updates: {
    quantity?: number;
    scheduledDate?: string;
    scheduledTime?: string;
  },
) {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function clearCart() {
  try {
    const response = await fetch("/api/cart/clear", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
