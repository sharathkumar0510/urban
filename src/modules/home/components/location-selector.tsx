"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  className?: string;
  onLocationChange?: (location: string) => void;
}

export default function LocationSelector({
  className,
  onLocationChange,
}: LocationSelectorProps) {
  const [location, setLocation] = useState("San Francisco, CA");

  const handleLocationChange = () => {
    // In a real app, this would open a location picker dialog
    const newLocation = prompt("Enter your location", location);
    if (newLocation) {
      setLocation(newLocation);
      if (onLocationChange) {
        onLocationChange(newLocation);
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-700">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{location}</span>
        <button
          onClick={handleLocationChange}
          className="text-blue-600 text-xs font-medium"
        >
          Change
        </button>
      </div>
    </div>
  );
}
