import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function useMouseUniform(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const toNDC = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
    };

    const onMove = (e: PointerEvent) => toNDC(e.clientX, e.clientY);
    const onLeave = () => mouseRef.current.set(0, 0);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      toNDC(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => mouseRef.current.set(0, 0);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [containerRef]);

  return mouseRef;
}
