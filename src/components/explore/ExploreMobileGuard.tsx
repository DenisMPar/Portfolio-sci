'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export function ExploreMobileGuard() {
  const { replace } = useRouter();

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) {
      replace('/');
    }
  }, [replace]);

  return null;
}
