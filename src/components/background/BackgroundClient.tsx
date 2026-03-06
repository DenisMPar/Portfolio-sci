'use client';

import dynamic from 'next/dynamic';

const BackgroundScene = dynamic(
  () => import('./BackgroundScene').then((m) => m.BackgroundScene),
  { ssr: false }
);

export function BackgroundClient() {
  return <BackgroundScene />;
}
