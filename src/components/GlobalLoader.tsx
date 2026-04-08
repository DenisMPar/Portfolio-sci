"use client";

import { useBackgroundReady } from "./background/BackgroundReadyContext";
import { useEffect, useState } from "react";

export function GlobalLoader() {
  const isReady = useBackgroundReady();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isReady) {
      // Wait for the fade-out animation to complete before removing from DOM
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 pointer-events-none select-none ${
        isReady ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple retro spinner */}
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        
        <div className="text-sm tracking-widest text-primary/80 animate-pulse">
          INITIALIZING_
        </div>
      </div>
    </div>
  );
}
