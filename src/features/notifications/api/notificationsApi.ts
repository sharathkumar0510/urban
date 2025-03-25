export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchNotifications(options?: {
  limit?: number;
  page?: number;
  unreadOnly?: boolean;
}) {
  try {
    const params = new URLSearchParams();

    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }

    if (options?.page) {
      params.append("page", options.page.toString());
    }

    if (options?.unreadOnly) {
      params.append("unread", "true");
    }

    const url = `/api/notifications${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const response = await fetch(`/api/notifications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, isRead: true }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await fetch(`/api/notifications/read-all`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}
