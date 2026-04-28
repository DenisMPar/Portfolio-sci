"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

const BackgroundReadyContext = createContext(false);
const BackgroundReadySetContext = createContext<() => void>(() => {});

export function BackgroundReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  // Fire ready after first paint — independent of Three.js load time
  useEffect(() => { setReady(true); }, []);
  const markReady = useCallback(() => {}, []);

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
