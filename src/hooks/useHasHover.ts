"use client";

import { useState, useEffect } from 'react';

// Global flag to track if initial SSR hydration is complete.
// This prevents double-renders on client-side navigations.
let isHydrated = false;

export function useHasHover() {
  const [hasHover, setHasHover] = useState(() => {
    // If we've already hydrated, we can safely return the real value
    // immediately without causing a hydration mismatch.
    if (typeof window !== 'undefined' && isHydrated) {
      return window.matchMedia('(hover: hover)').matches;
    }
    // Default to true (desktop) for SSR and initial hydration
    return true;
  });

  useEffect(() => {
    isHydrated = true;
    const mql = window.matchMedia('(hover: hover)');
    
    // Update if it doesn't match our initial assumption
    if (hasHover !== mql.matches) {
      setHasHover(mql.matches);
    }

    // Listen for changes (e.g. attaching a mouse to an iPad)
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [hasHover]);

  return hasHover;
}
