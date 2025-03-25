"use client";

import { TempoDevtools } from "tempo-devtools";
import { useEffect } from "react";

export function TempoInit() {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_TEMPO &&
      typeof TempoDevtools !== "undefined" &&
      TempoDevtools?.init
    ) {
      try {
        TempoDevtools.init();
      } catch (error) {
        console.error("Error initializing TempoDevtools:", error);
      }
    }
  }, []);

  return null;
}
