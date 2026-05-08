'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export function ExploreMobileGuard() {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) {
      router.replace('/');
    }
  }, [router]);

  return null;
}
