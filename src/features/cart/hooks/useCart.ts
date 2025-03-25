import { useState, useEffect, useCallback } from "react";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  CartItem,
} from "../api/cartApi";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await fetchCart();
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (item: {
      serviceId: string;
      price: number;
      quantity?: number;
      scheduledDate?: string;
      scheduledTime?: string;
    }) => {
      try {
        setLoading(true);
        await addToCart(item);
        await loadCart();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadCart],
  );

  const updateItem = useCallback(
    async (
      itemId: string,
      updates: {
        quantity?: number;
        scheduledDate?: string;
        scheduledTime?: string;
      },
    ) => {
      try {
        setLoading(true);
        await updateCartItem(itemId, updates);
        await loadCart();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadCart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        setLoading(true);
        await removeFromCart(itemId);
        await loadCart();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadCart],
  );

  const emptyCart = useCallback(async () => {
    try {
      setLoading(true);
      await clearCart();
      setCartItems([]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * (item.quantity || 1);
  }, 0);

  const itemCount = cartItems.reduce((count, item) => {
    return count + (item.quantity || 1);
  }, 0);

  return {
    cartItems,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    emptyCart,
    cartTotal,
    itemCount,
    refresh: loadCart,
  };
}
