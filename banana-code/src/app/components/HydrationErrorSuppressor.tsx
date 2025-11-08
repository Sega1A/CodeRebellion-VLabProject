"use client";

import { useEffect } from "react";

export default function HydrationErrorSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("Hydration") ||
            args[0].includes("hydration") ||
            args[0].includes("did not match"))
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}
