"use client";

import { useState, useCallback, useEffect } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { NoiseTexture, CrtScanlines, VignetteEdge, ColorAberration } from "../panel";

export function Gallery({
  images,
  initialIndex,
  onClose,
}: {
  images: { src: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const prefersReduced = useReducedMotion();
  const t = useTranslations("projects");
  const direction = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") direction(1);
      if (e.key === "ArrowLeft") direction(-1);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, direction]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label={t("galleryLabel")}
    >
      <m.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-40vh)" }}
        animate={prefersReduced
          ? { opacity: 1, transition: { duration: 0.15 } }
          : { opacity: 1, transform: "translateY(0vh)", transition: { type: "spring", damping: 25, stiffness: 200 } }
        }
        exit={prefersReduced
          ? { opacity: 0, transition: { duration: 0.15 } }
          : { opacity: 0, transform: "translateY(-30vh)", transition: { duration: 0.3, ease: "easeIn" } }
        }
        className="relative w-[96vw] h-[65vh] sm:w-[92vw] sm:h-[88vh] max-w-[1600px] overflow-hidden bg-card before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/8 before:to-transparent before:pointer-events-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <NoiseTexture />
        <CrtScanlines />
        <VignetteEdge />
        <ColorAberration />
        <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-20" />
        <div aria-hidden="true" className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-20" />

        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-primary/15">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-primary rotate-45 shadow-[0_0_8px_var(--primary-strong)]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest text-foreground/55 font-display">
              {t("gallery", { current: index + 1, total: images.length })}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-accent pointer-hover:text-accent/80 transition-[color,transform] active:scale-[0.97] text-xs uppercase tracking-widest cursor-pointer"
            aria-label={t("closeLabel")}
          >
            [ {t("close")} ]
          </button>
        </div>

        <div className="relative flex-1 h-[calc(100%-theme(spacing.12))]">
          <button
            type="button"
            onClick={() => direction(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 pointer-hover:text-foreground/80 transition-[color,transform] active:scale-[0.97] text-3xl cursor-pointer"
            aria-label={t("prevImage")}
          >
            ‹
          </button>

          <AnimatePresence mode="wait">
            <m.div
              key={index}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="relative w-full h-full p-2 sm:p-8"
            >
              <Image
                unoptimized
                src={images[index].src}
                alt={images[index].alt}
                fill
                className="object-contain p-2 sm:p-8"
                sizes="85vw"
              />
            </m.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => direction(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 pointer-hover:text-foreground/80 transition-[color,transform] active:scale-[0.97] text-3xl cursor-pointer"
            aria-label={t("nextImage")}
          >
            ›
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-3 py-3 border-t border-primary/15">
          {images.map((img, i) => (
            <button
              key={img.src || i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rotate-45 transition-[background-color,box-shadow,transform] duration-200 ease-out cursor-pointer active:scale-[0.75] ${
                i === index
                  ? "bg-primary shadow-[0_0_8px_var(--primary-strong)]"
                  : "bg-foreground/20 pointer-hover:bg-foreground/40"
              }`}
              aria-label={t("goToImage", { n: i + 1 })}
            />
          ))}
        </div>
      </m.div>
    </m.div>
  );
}
