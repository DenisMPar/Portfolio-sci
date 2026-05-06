"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { NoiseTexture, CrtScanlines, VignetteEdge, ColorAberration } from "../panel";
import { useHasHover } from "@/hooks/useHasHover";
import type { Project } from "@/data/projects";

function Gallery({
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
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: "-40vh" }}
        animate={prefersReduced
          ? { opacity: 1, transition: { duration: 0.15 } }
          : { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }
        }
        exit={prefersReduced
          ? { opacity: 0, transition: { duration: 0.15 } }
          : { opacity: 0, y: "-30vh", transition: { duration: 0.3, ease: "easeIn" } }
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
            <div className="w-2 h-2 bg-primary rotate-45 shadow-[0_0_8px_var(--primary-strong)]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest text-foreground/55 font-display">
              {t("gallery", { current: index + 1, total: images.length })}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-accent hover:text-accent/80 transition-colors text-xs uppercase tracking-widest cursor-pointer"
            aria-label={t("closeLabel")}
          >
            [ {t("close")} ]
          </button>
        </div>

        <div className="relative flex-1 h-[calc(100%-theme(spacing.12))]">
          <button
            type="button"
            onClick={() => direction(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 hover:text-foreground/80 transition-colors text-3xl cursor-pointer"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 hover:text-foreground/80 transition-colors text-3xl cursor-pointer"
            aria-label={t("nextImage")}
          >
            ›
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-3 py-3 border-t border-primary/15">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rotate-45 transition-all cursor-pointer ${
                i === index
                  ? "bg-primary shadow-[0_0_8px_var(--primary-strong)]"
                  : "bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={t("goToImage", { n: i + 1 })}
            />
          ))}
        </div>
      </m.div>
    </m.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 250 },
  },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const metaRowVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

function ProjectPreview({ project, hasHover }: { project: Project; hasHover: boolean }) {
  const prefersReduced = useReducedMotion();
  const t = useTranslations("projects");
  const clipInitial = prefersReduced ? { opacity: 0 } : { clipPath: hasHover ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)" };
  const clipVisible = prefersReduced ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" };
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setCarouselIndex(0); }, [project.slug]);

  const closeGallery = useCallback(() => setGalleryIndex(null), []);

  const galleryImages = project.images.map((src, i) => ({
    src,
    alt: i === 0 ? project.title : `${project.title} — ${i}`,
  }));

  const hasSections = project.sections.length > 0;
  const hasMultipleImages = project.images.length > 1;

  const prevImage = useCallback(() => {
    setCarouselIndex((i) => (i - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  const nextImage = useCallback(() => {
    setCarouselIndex((i) => (i + 1) % project.images.length);
  }, [project.images.length]);

  return (
    <div className="relative flex flex-col lg:flex-1 lg:min-h-0">
      {mounted &&
        createPortal(
          <AnimatePresence>
            {galleryIndex !== null && (
              <Gallery images={galleryImages} initialIndex={galleryIndex} onClose={closeGallery} />
            )}
          </AnimatePresence>,
          document.body,
        )}


      <AnimatePresence mode="wait">
        <m.div
          key={project.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { clipPath: hasHover ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.15 }}
          className="flex flex-col lg:flex-1 lg:min-h-0"
        >
          {/* Visual zone — carousel + optional sections */}
          <div className={`flex flex-col lg:grid ${hasSections ? "lg:grid-cols-[55fr_45fr]" : ""} lg:grid-rows-[1fr_auto] lg:flex-1 lg:min-h-0 lg:overflow-hidden`}>
            {/* Carousel */}
            {project.images.length > 0 && (
              <m.button
                type="button"
                className="relative aspect-video lg:aspect-auto lg:row-start-1 lg:col-start-1 cursor-pointer overflow-hidden group"
                onClick={() => setGalleryIndex(carouselIndex)}
                initial={clipInitial}
                animate={clipVisible}
                transition={prefersReduced ? { duration: 0.15 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-[-100%] animate-[border-glow_5s_linear_infinite] motion-reduce:animate-none"
                    style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--accent) 85%, transparent 95%)' }}
                  />
                </div>
                <div
                  className="absolute inset-[1px] z-[5] animate-[skeleton-shimmer_2s_ease-in-out_infinite] motion-reduce:animate-none"
                  style={{
                    background: 'linear-gradient(90deg, var(--background) 30%, var(--background-elevated) 50%, var(--background) 70%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                <div className="absolute inset-[1px] z-10 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={carouselIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        unoptimized
                        src={project.images[carouselIndex]}
                        alt={carouselIndex === 0 ? project.title : `${project.title} — ${carouselIndex}`}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                        sizes="(max-width: 768px) 90vw, 50vw"
                      />
                    </m.div>
                  </AnimatePresence>
                </div>

                {/* Carousel controls */}
                {hasMultipleImages && (
                  <>
                    <div
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center min-w-[44px] min-h-[44px] text-foreground/50 hover:text-foreground/90 transition-colors text-2xl bg-background/60 backdrop-blur-sm rounded-sm"
                      role="button"
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); prevImage(); } }}
                      tabIndex={0}
                      aria-label={t("prevImage")}
                    >
                      ‹
                    </div>
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center min-w-[44px] min-h-[44px] text-foreground/50 hover:text-foreground/90 transition-colors text-2xl bg-background/60 backdrop-blur-sm rounded-sm"
                      role="button"
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); nextImage(); } }}
                      tabIndex={0}
                      aria-label={t("nextImage")}
                    >
                      ›
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
                      {project.images.map((_, i) => (
                        <div
                          key={i}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setCarouselIndex(i); } }}
                          className="w-6 h-6 flex items-center justify-center cursor-pointer"
                          aria-label={t("goToImage", { n: i + 1 })}
                        >
                          <span className={`w-1.5 h-1.5 rotate-45 transition-all block ${
                            i === carouselIndex
                              ? "bg-primary shadow-[0_0_6px_var(--primary-strong)]"
                              : "bg-foreground/30 hover:bg-foreground/50"
                          }`} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </m.button>
            )}

            {/* Info row — inside the grid so on mobile it sits between carousel and sections */}
            <div className="shrink-0 lg:col-span-2 lg:row-start-2">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left motion-reduce:!animate-none"
                  style={{ transform: 'scaleX(0)', animation: 'line-expand 0.8s ease-out 0.2s forwards' }}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr]">
                <m.div
                  className="px-4 py-3 flex flex-col gap-1.5 overflow-y-auto"
                  initial={clipInitial}
                  animate={clipVisible}
                  transition={prefersReduced ? { duration: 0.15 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <m.h2
                    className="glitch font-medium text-foreground text-base 2xl:text-lg text-wrap-balance"
                    data-text={project.title}
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={prefersReduced ? { duration: 0.15 } : { duration: 0.25, ease: "easeOut", delay: 0.2 }}
                  >
                    {project.title}
                  </m.h2>
                  <m.p
                    className="text-sm 2xl:text-base text-foreground/60 leading-relaxed font-light"
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={prefersReduced ? { duration: 0.15 } : { duration: 0.4, ease: "easeOut", delay: 0.38 }}
                  >
                    {project.description}
                  </m.p>
                </m.div>

                <m.div
                  className="lg:border-l lg:border-primary/15 flex flex-col"
                  initial={clipInitial}
                  animate={clipVisible}
                  transition={prefersReduced ? { duration: 0.15 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                >
                  <div className="grid grid-cols-2 text-xs h-full">
                    <m.div
                      className="px-4 py-3"
                      variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.9 } } }}
                      initial={prefersReduced ? undefined : "hidden"}
                      animate={prefersReduced ? undefined : "visible"}
                    >
                      <m.span
                        className="uppercase tracking-widest text-foreground/55"
                        variants={prefersReduced ? undefined : metaRowVariants}
                      >
                        {t("stack")}
                      </m.span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {project.tags.map((tag) => (
                          <m.span
                            key={tag}
                            className="text-xs border border-primary/20 px-1.5 py-0.5 text-foreground/70 font-light"
                            variants={prefersReduced ? undefined : metaRowVariants}
                          >
                            {tag}
                          </m.span>
                        ))}
                      </div>
                    </m.div>
                    <m.div
                      className="flex flex-col border-l border-primary/15 px-4 py-2"
                      variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.9 } } }}
                      initial={prefersReduced ? undefined : "hidden"}
                      animate={prefersReduced ? undefined : "visible"}
                    >
                      <m.div
                        className="flex justify-between py-1.5"
                        variants={prefersReduced ? undefined : metaRowVariants}
                      >
                        <span className="uppercase tracking-widest text-foreground/55">{t("year")}</span>
                        <span className="text-foreground/70">{project.year}</span>
                      </m.div>
                      <m.div
                        className="flex justify-between py-1.5 border-t border-primary/10"
                        variants={prefersReduced ? undefined : metaRowVariants}
                      >
                        <span className="uppercase tracking-widest text-foreground/55">{t("role")}</span>
                        <span className="text-foreground/70">
                          {project.role === "Solo Dev" ? t("roleSoloDev") : t("roleTeamDev")}
                        </span>
                      </m.div>
                      {project.type && (
                        <m.div
                          className="flex justify-between py-1.5 border-t border-primary/10"
                          variants={prefersReduced ? undefined : metaRowVariants}
                        >
                          <span className="uppercase tracking-widest text-foreground/55">{t("type")}</span>
                          <span className="text-foreground/70">
                            {project.type === "showcase" ? t("typeShowcase") : t("typeCaseStudy")}
                          </span>
                        </m.div>
                      )}
                      {(project.liveUrl || project.repoUrl) && (
                        <m.div
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1.5 border-t border-primary/10 gap-1.5 sm:gap-0"
                          variants={prefersReduced ? undefined : metaRowVariants}
                        >
                          <span className="uppercase tracking-widest text-foreground/55">{t("links")}</span>
                          <div className="flex gap-3">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors text-sm"
                              >
                                [ {t("live")} ]
                              </a>
                            )}
                            {project.repoUrl && (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors text-sm"
                              >
                                [ {t("repo")} ]
                              </a>
                            )}
                          </div>
                        </m.div>
                      )}
                    </m.div>
                  </div>
                </m.div>
              </div>
            </div>

            {/* Sections — right column on desktop, below metadata on mobile */}
            {hasSections && (
              <m.div
                className="flex flex-col lg:flex-1 lg:min-h-0 lg:overflow-y-auto px-5 py-4 gap-4 border-t lg:border-t-0 lg:border-l border-primary/15 lg:col-start-2 lg:row-start-1"
                initial={clipInitial}
                animate={clipVisible}
                transition={prefersReduced ? { duration: 0.15 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              >
                {project.sections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs uppercase tracking-widest text-primary font-display mb-1">
                      {section.title}
                    </p>
                    <p className="text-sm 2xl:text-base text-foreground/70 leading-relaxed font-light">
                      {section.content}
                    </p>
                  </div>
                ))}
              </m.div>
            )}
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectNav({
  projects,
  activeSlug,
  onSelect,
}: {
  projects: Project[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateFades = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, [updateFades]);

  const maskImage = (() => {
    if (showLeft && showRight) return "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)";
    if (showLeft) return "linear-gradient(to right, transparent 0px, black 40px)";
    if (showRight) return "linear-gradient(to right, black calc(100% - 40px), transparent 100%)";
    return undefined;
  })();

  const t = useTranslations("projects");
  return (
    <nav
      ref={navRef}
      aria-label={t("listLabel")}
      className="flex sm:flex-col gap-0.5 overflow-x-auto sm:overflow-x-hidden px-2 sm:px-0"
      style={{ maskImage, WebkitMaskImage: maskImage }}
    >
      {projects.map((project, index) => {
        const isActive = project.slug === activeSlug;
        return (
          <button
            key={project.slug}
            onClick={() => onSelect(project.slug)}
            aria-current={isActive ? "true" : undefined}
            className={`shrink-0 sm:shrink flex items-center gap-2 px-2.5 sm:px-3 py-2 text-left ${isActive ? "cursor-default" : "cursor-pointer"} transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${
              isActive
                ? "bg-primary/10 border-b-2 sm:border-b-0 border-b-state-active sm:border-l-2 sm:border-l-state-active text-foreground sm:translate-x-1"
                : "border-b-2 sm:border-b-0 border-b-transparent sm:border-l-2 sm:border-l-transparent text-foreground/55 hover:text-foreground/80 hover:bg-primary/5 sm:hover:translate-x-1 sm:hover:border-l-primary/40"
            }`}
          >
            <span className="text-xs 2xl:text-sm text-primary shrink-0 font-light">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm 2xl:text-base truncate font-normal">{project.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const defaultSlug = projects[0]?.slug ?? "";
  const [activeSlug, setActiveSlug] = useState(
    () => searchParams.get("project") ?? defaultSlug,
  );
  const hasHover = useHasHover();
  const prefersReduced = useReducedMotion();
  const t = useTranslations("projects");
  const selectProject = useCallback((slug: string) => {
    setActiveSlug(slug);
    window.history.replaceState(null, "", `/projects?project=${slug}`);
  }, []);

  const activeProject = projects.find((p) => p.slug === activeSlug) ?? projects[0];

  if (projects.length === 0) {
    return (
      <section
        id="projects"
        className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
        style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
      >
        <AnimatedPanel title={t("panelTitle")} className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
          <div className="min-h-full flex items-center justify-center">
            <p className="text-sm text-foreground/55">{t("empty")}</p>
          </div>
        </AnimatedPanel>
      </section>
    );
  }

  const preview = activeProject && <ProjectPreview project={activeProject} hasHover={hasHover} />;

  const content = (
    <div className="flex flex-col sm:grid sm:grid-cols-[12rem_1fr] w-full sm:h-full">
      <div className="border-b sm:border-b-0 sm:border-r border-primary/15 py-2 overflow-hidden">
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </div>
      <div className="flex flex-col sm:min-h-0 sm:overflow-y-auto lg:overflow-hidden">
        {preview}
      </div>
    </div>
  );

  const staggeredContent = (
    <m.div
      className="flex flex-col sm:grid sm:grid-cols-[12rem_1fr] w-full sm:h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <m.div
        className="border-b sm:border-b-0 sm:border-r border-primary/15 py-2 overflow-hidden"
        variants={prefersReduced ? reducedItemVariants : itemVariants}
      >
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </m.div>
      <m.div
        className="flex flex-col sm:min-h-0 sm:overflow-y-auto lg:overflow-hidden"
        variants={prefersReduced ? reducedItemVariants : itemVariants}
      >
        {preview}
      </m.div>
    </m.div>
  );

  return (
    <section
      id="projects"
      className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
      style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
    >
      <AnimatedPanel title={t("panelTitle")} className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
        <div className="sm:h-full flex items-start justify-center">
          {hasHover ? staggeredContent : content}
        </div>
      </AnimatedPanel>
    </section>
  );
}
