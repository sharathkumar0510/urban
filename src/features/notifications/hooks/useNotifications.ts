import { useState, useEffect, useCallback } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  Notification,
} from "../api/notificationsApi";

export function useNotifications(options?: {
  limit?: number;
  page?: number;
  unreadOnly?: boolean;
  autoRefresh?: boolean;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(options?.page || 1);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchNotifications({
        limit: options?.limit,
        page: currentPage,
        unreadOnly: options?.unreadOnly,
      });

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, options?.limit, options?.unreadOnly]);

  useEffect(() => {
    loadNotifications();

    // Set up auto-refresh if enabled
    if (options?.autoRefresh) {
      const interval = setInterval(loadNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [loadNotifications, options?.autoRefresh]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    totalPages,
    currentPage,
    refresh: loadNotifications,
    markAsRead,
    goToPage,
  };
}
