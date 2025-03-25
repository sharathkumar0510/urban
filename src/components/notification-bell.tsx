"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead } = useNotifications({
    limit: 5,
    autoRefresh: true,
  });
  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-medium border-b">Notifications</div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-500">
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t text-center">
            <Button variant="link" size="sm" className="text-xs" asChild>
              <a href="/notifications">View All</a>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
