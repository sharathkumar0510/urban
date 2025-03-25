"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem as CartItemType } from "../api/cartApi";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onUpdateSchedule?: (id: string, date: string, time: string) => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdateSchedule,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [date, setDate] = useState(item.scheduledDate || "");
  const [time, setTime] = useState(item.scheduledTime || "");
  const [isScheduling, setIsScheduling] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const handleScheduleUpdate = () => {
    if (onUpdateSchedule && date && time) {
      onUpdateSchedule(item.id, date, time);
      setIsScheduling(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b border-gray-200 py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={
            item.service?.image ||
            `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(item.service?.name || "service")}`
          }
          alt={item.service?.name || "Service"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{item.service?.name || "Service"}</h3>
          <p className="ml-4">${item.price.toFixed(2)}</p>
        </div>

        {item.service?.vendor?.name && (
          <p className="mt-1 text-sm text-gray-500">
            Provider: {item.service.vendor.name}
          </p>
        )}

        {item.service?.duration && (
          <p className="mt-1 text-sm text-gray-500">
            Duration: {item.service.duration} minutes
          </p>
        )}

        {(item.scheduledDate || item.scheduledTime) && (
          <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {item.scheduledDate &&
                new Date(item.scheduledDate).toLocaleDateString()}
              {item.scheduledTime && ` at ${item.scheduledTime}`}
            </span>
          </div>
        )}

        {isScheduling ? (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Time</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsScheduling(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleScheduleUpdate}
                disabled={!date || !time}
                className="text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`quantity-${item.id}`} className="text-gray-500">
                Qty
              </label>
              <Input
                id={`quantity-${item.id}`}
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-8"
              />

              {onUpdateSchedule && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScheduling(true)}
                  className="ml-2 text-xs flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  Schedule
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
