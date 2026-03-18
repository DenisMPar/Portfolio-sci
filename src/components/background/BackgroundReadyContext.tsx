"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

const BackgroundReadyContext = createContext(false);
const BackgroundReadySetContext = createContext<() => void>(() => {});

export function BackgroundReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <LazyMotion features={domAnimation} strict>
      <BackgroundReadyContext.Provider value={ready}>
        <BackgroundReadySetContext.Provider value={markReady}>
          {children}
        </BackgroundReadySetContext.Provider>
      </BackgroundReadyContext.Provider>
    </LazyMotion>
  );
}

export function useBackgroundReady() {
  return useContext(BackgroundReadyContext);
}

export function useMarkBackgroundReady() {
  return useContext(BackgroundReadySetContext);
}
