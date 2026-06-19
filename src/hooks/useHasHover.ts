"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover)";

// Cache the MediaQueryList once on the client so getSnapshot is a cheap
// property read rather than a matchMedia() call on every store read.
const mql = typeof window !== "undefined" ? window.matchMedia(QUERY) : null;

function subscribe(callback: () => void) {
  if (!mql) return () => {};
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return mql ? mql.matches : true;
}

// Assume a hover-capable (desktop) device during SSR and the first client
// render so the server and hydrated markup match. The real value is read on
// the client immediately after hydration via getSnapshot.
function getServerSnapshot() {
  return true;
}

export function useHasHover() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
