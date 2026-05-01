'use client';

import { useState, useEffect } from 'react';
import { BackgroundClient } from './BackgroundClient';

export function DeferredBackground() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
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
