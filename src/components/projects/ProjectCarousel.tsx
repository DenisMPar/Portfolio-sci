"use client";

import { m, AnimatePresence } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

type MotionTarget = TargetAndTransition;

export function ProjectCarousel({
  images,
  title,
  activeIndex,
  hasMultiple,
  clipInitial,
  clipVisible,
  prefersReduced,
  onPrev,
  onNext,
  onSelectIndex,
  onOpen,
}: {
  images: string[];
  title: string;
  activeIndex: number;
  hasMultiple: boolean;
  clipInitial: MotionTarget;
  clipVisible: MotionTarget;
  prefersReduced: boolean | null;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (i: number) => void;
  onOpen: () => void;
}) {
  const t = useTranslations("projects");
  return (
    <m.button
      type="button"
      className="relative aspect-video lg:aspect-auto lg:row-start-1 lg:col-start-1 cursor-pointer overflow-hidden group"
      onClick={onOpen}
      initial={clipInitial}
      animate={clipVisible}
      transition={prefersReduced ? { duration: 0.15 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-primary/20" />
      <div className="absolute inset-0 opacity-0 group-pointer-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-[-100%] animate-[border-glow_5s_linear_infinite] motion-reduce:animate-none"
          style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--accent) 85%, transparent 95%)' }}
        />
      </div>
      <div
        className="absolute inset-[1px] z-[5] animate-[skeleton-shimmer_2s_linear_infinite] motion-reduce:animate-none"
        style={{
          background: 'linear-gradient(90deg, var(--background) 30%, var(--background-elevated) 50%, var(--background) 70%)',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="absolute inset-[1px] z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              unoptimized
              src={images[activeIndex]}
              alt={activeIndex === 0 ? title : `${title} — ${activeIndex}`}
              fill
              className="object-cover transition-[transform,filter] duration-300 group-pointer-hover:scale-[1.03] group-pointer-hover:brightness-110"
              sizes="(max-width: 768px) 90vw, 50vw"
            />
          </m.div>
        </AnimatePresence>
      </div>

      {hasMultiple && (
        <>
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center min-w-[44px] min-h-[44px] text-foreground/50 pointer-hover:text-foreground/90 transition-[color,transform] active:scale-[0.97] text-2xl bg-background/60 backdrop-blur-sm rounded-sm"
            role="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onPrev(); } }}
            tabIndex={0}
            aria-label={t("prevImage")}
          >
            ‹
          </div>
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center min-w-[44px] min-h-[44px] text-foreground/50 pointer-hover:text-foreground/90 transition-[color,transform] active:scale-[0.97] text-2xl bg-background/60 backdrop-blur-sm rounded-sm"
            role="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onNext(); } }}
            tabIndex={0}
            aria-label={t("nextImage")}
          >
            ›
          </div>
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
            {images.map((img, i) => (
              <div
                key={img || i}
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onSelectIndex(i); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onSelectIndex(i); } }}
                className="size-6 flex items-center justify-center cursor-pointer transition-transform active:scale-[0.85]"
                aria-label={t("goToImage", { n: i + 1 })}
              >
                <span className={`w-1.5 h-1.5 rotate-45 transition-[background-color,box-shadow] duration-200 ease-out block ${
                  i === activeIndex
                    ? "bg-primary shadow-[0_0_6px_var(--primary-strong)]"
                    : "bg-foreground/30 pointer-hover:bg-foreground/50"
                }`} />
              </div>
            ))}
          </div>
        </>
      )}
    </m.button>
  );
}
