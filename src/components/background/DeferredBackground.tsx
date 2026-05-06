'use client';

import { useState, useEffect } from 'react';
import { BackgroundClient } from './BackgroundClient';

export function DeferredBackground() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    try {
      const probe = document.createElement('canvas');
      const ctx = probe.getContext('webgl') ?? probe.getContext('experimental-webgl');
      if (!ctx) return;
    } catch {
      return;
    }
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div className="transition-opacity duration-[1500ms]" style={{ opacity: visible ? 1 : 0 }}>
      <BackgroundClient />
    </div>
  );
}
