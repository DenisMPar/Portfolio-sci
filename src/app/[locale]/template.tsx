"use client";

import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const ready = useBackgroundReady();

  return (
    <div
      style={{
        animation: ready ? "page-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
        opacity: ready ? undefined : 0,
      }}
    >
      {children}
    </div>
  );
}
