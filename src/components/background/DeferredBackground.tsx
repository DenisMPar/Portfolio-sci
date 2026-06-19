'use client';

import { useState, useEffect } from 'react';
import { BackgroundClient } from './BackgroundClient';

type Phase = 'hidden' | 'mounted' | 'visible';

export function DeferredBackground() {
  const [phase, setPhase] = useState<Phase>('hidden');

  useEffect(() => {
    // Mobile (hover: none) keeps a lightweight version of the scene: the
    // ParticleCloud degrades to rotation-only and BackgroundScene skips the
    // postprocessing pass, so only the WebGL probe gates mounting here.
    try {
      const probe = document.createElement('canvas');
      const ctx = probe.getContext('webgl') ?? probe.getContext('experimental-webgl');
      if (!ctx) return;
    } catch {
      return;
    }
    setPhase('mounted');
    const t = setTimeout(() => setPhase('visible'), 200);
    return () => clearTimeout(t);
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div className="transition-opacity duration-[1500ms]" style={{ opacity: phase === 'visible' ? 1 : 0 }}>
      <BackgroundClient />
    </div>
  );
}
