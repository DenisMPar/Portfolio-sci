'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { RiRocketLine } from 'react-icons/ri';
import { useHasHover } from '@/hooks/useHasHover';

const NATURAL_TIP_ANGLE = (-88 * Math.PI) / 180;
const ICON_DRAW_SIZE = 22;
const ICON_SOURCE_SIZE = 64;
const PARTICLE_RGB = '61, 214, 132';
const SPEED_THRESHOLD = 0.4;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

export function RocketCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconHostRef = useRef<HTMLDivElement>(null);
  const hasHover = useHasHover();
  const prefersReduced = useReducedMotion();
  const enabled = hasHover && !prefersReduced;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const host = iconHostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const svgEl = host.querySelector('svg');
    if (!svgEl) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = 'high';
    };
    resize();

    let targetX = width / 2;
    let targetY = height / 2;
    let x = targetX;
    let y = targetY;
    let prevX = x;
    let prevY = y;
    let currentAngle = 0;
    let targetAngle = 0;
    let rafId = 0;
    let imgLoaded = false;

    if (!svgEl.getAttribute('xmlns')) {
      svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    const xml = new XMLSerializer().serializeToString(svgEl);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const img = new Image();
    img.onload = () => {
      imgLoaded = true;
    };
    img.src = dataUrl;
    if (img.complete && img.naturalWidth > 0) imgLoaded = true;

    const particles: Particle[] = [];

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      prevX = x;
      prevY = y;
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      const vx = x - prevX;
      const vy = y - prevY;
      const speed = Math.hypot(vx, vy);

      if (speed > SPEED_THRESHOLD) {
        targetAngle = Math.atan2(vy, vx) - NATURAL_TIP_ANGLE;
      }
      const diff = Math.atan2(
        Math.sin(targetAngle - currentAngle),
        Math.cos(targetAngle - currentAngle)
      );
      currentAngle += diff * 0.22;

      const facing = currentAngle + NATURAL_TIP_ANGLE;
      const tailX = x - Math.cos(facing) * 10;
      const tailY = y - Math.sin(facing) * 10;

      const spawnCount = Math.min(3, Math.floor(speed * 0.6));
      for (let i = 0; i < spawnCount; i++) {
        particles.push({
          x: tailX + (Math.random() - 0.5) * 3,
          y: tailY + (Math.random() - 0.5) * 3,
          vx: -Math.cos(facing) * 0.55 + (Math.random() - 0.5) * 0.4,
          vy: -Math.sin(facing) * 0.55 + (Math.random() - 0.5) * 0.4,
          life: 1,
          size: 2 + Math.random() * 1.8,
        });
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.022;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${PARTICLE_RGB}, ${p.life * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      if (imgLoaded) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(currentAngle);
        ctx.drawImage(img, -ICON_DRAW_SIZE / 2, -ICON_DRAW_SIZE / 2, ICON_DRAW_SIZE, ICON_DRAW_SIZE);
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    document.documentElement.style.cursor = 'none';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      document.documentElement.style.cursor = '';
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={iconHostRef}
        aria-hidden
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <RiRocketLine size={ICON_SOURCE_SIZE} color="#3dd684" />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="fixed inset-0 z-[25] pointer-events-none"
      />
    </>
  );
}
