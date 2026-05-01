'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

const BackgroundScene = dynamic(
  () => import('./BackgroundScene').then((m) => m.BackgroundScene),
  { ssr: false }
);

export function BackgroundClient() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;
  return <BackgroundScene />;
}
