'use client';

import { useRef, useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

const CHAMFER = 12;
const LINE_LENGTH = 40;

function buildPath(w: number, h: number) {
  return `M ${CHAMFER} 0 L ${w} 0 L ${w} ${h - CHAMFER} L ${w - CHAMFER} ${h} L 0 ${h} L 0 ${CHAMFER} Z`;
}

function buildPathLength(w: number, h: number) {
  return 2 * (w + h) - 4 * CHAMFER + 2 * CHAMFER * Math.SQRT2;
}

export function HeroCtaButton({ label }: { label: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pathD, setPathD] = useState('');
  const [totalLength, setTotalLength] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setPathD(buildPath(width, height));
      setTotalLength(buildPathLength(width, height));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="mt-10 relative inline-block"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHovered(false); }}
    >
      <div
        className="[background:var(--accent-dim)] hover:[background:var(--accent-vivid)] transition-[background-color,transform] duration-200 active:scale-[0.97]"
        style={{
          clipPath: "polygon(12px 0, calc(100% + 1px) 0, calc(100% + 1px) calc(100% - 12px), calc(100% - 12px) calc(100% + 1px), 0 calc(100% + 1px), 0 12px)",
          padding: "1px",
        }}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono text-accent/80 tracking-wider uppercase hover:bg-accent/10 hover:text-accent transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{
            clipPath: "polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)",
            background: "var(--card-deep)",
          }}
        >
          {label}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {totalLength > 0 && (
        <>
          <style>{`
            @keyframes cta-line-orbit {
              from { stroke-dashoffset: 0; }
              to   { stroke-dashoffset: ${-totalLength.toFixed(2)}; }
            }
          `}</style>
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            <path
              className="cta-dot"
              d={pathD}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${LINE_LENGTH} ${totalLength - LINE_LENGTH}`}
              style={{
                filter: 'drop-shadow(0 0 3px var(--accent)) drop-shadow(0 0 8px var(--accent))',
                animation: 'cta-line-orbit 2s linear infinite',
                animationPlayState: hovered ? 'running' : 'paused',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.4s',
              }}
            />
          </svg>
        </>
      )}
    </div>
  );
}
