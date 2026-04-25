"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { NoiseTexture, CrtScanlines, VignetteEdge, ColorAberration } from "../panel";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
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
      aria-label="Image gallery"
    >
      {/* Frame */}
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
        className="relative w-[92vw] h-[88vh] max-w-[1600px] overflow-hidden bg-card before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/8 before:to-transparent before:pointer-events-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          clipPath: "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        <NoiseTexture />
        <CrtScanlines />
        <VignetteEdge />
        <ColorAberration />
        {/* Top glow line */}
        <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-20" />
        {/* Bottom glow line */}
        <div aria-hidden="true" className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-20" />

        {/* Header bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-primary/15">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rotate-45 shadow-[0_0_8px_rgba(80,140,204,0.6)]" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest text-foreground/50 font-display">
              Gallery — {index + 1} / {images.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-accent hover:text-accent/80 transition-colors text-xs uppercase tracking-widest cursor-pointer"
            aria-label="Close gallery"
          >
            [ Close ]
          </button>
        </div>

        {/* Image area */}
        <div className="relative flex-1 h-[calc(100%-theme(spacing.12))]">
          <button
            type="button"
            onClick={() => direction(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 hover:text-foreground/80 transition-colors text-3xl cursor-pointer"
            aria-label="Previous image"
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
              className="relative w-full h-full p-8"
            >
              <Image
                unoptimized
                src={images[index].src}
                alt={images[index].alt}
                fill
                className="object-contain p-8"
                sizes="85vw"
              />
            </m.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => direction(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground/30 hover:text-foreground/80 transition-colors text-3xl cursor-pointer"
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-3 py-3 border-t border-primary/15">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rotate-45 transition-all cursor-pointer ${
                i === index
                  ? "bg-primary shadow-[0_0_8px_rgba(80,140,204,0.6)]"
                  : "bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Go to image ${i + 1}`}
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

function ProjectPreview({ project }: { project: Project }) {
  const prefersReduced = useReducedMotion();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const closeGallery = useCallback(() => setGalleryIndex(null), []);

  const galleryImages = [
    { src: project.thumbnail, alt: project.title },
    ...(project.imgMovil ? [{ src: project.imgMovil, alt: `${project.title} — mobile` }] : []),
    ...(project.imgMedium ? [{ src: project.imgMedium, alt: `${project.title} — medium` }] : []),
  ];

  return (
    <>
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
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={prefersReduced ? { duration: 0.15 } : { type: "spring", damping: 25, stiffness: 250 }}
          className="flex flex-col h-full"
        >
          {/* Image grid — hero (60%) + 2 stacked squares (40%) when secondary images exist */}
          <div className={`grid ${project.imgMovil || project.imgMedium ? "grid-cols-[60fr_40fr]" : ""} flex-1 min-h-[250px] sm:min-h-0 overflow-hidden`}>
            <button
              type="button"
              className="relative min-h-0 cursor-pointer overflow-hidden group"
              onClick={() => setGalleryIndex(0)}
            >
              <div className="absolute inset-0 bg-primary/20" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute inset-[-100%] animate-[border-glow_5s_linear_infinite]"
                  style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--accent) 85%, transparent 95%)' }}
                />
              </div>
              <div className="absolute inset-[2px] z-10 overflow-hidden">
                <Image
                  unoptimized
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              </div>
            </button>

            {(project.imgMovil || project.imgMedium) && (
            <div className={`grid ${project.imgMovil && project.imgMedium ? "grid-rows-2" : ""} min-h-0 border-l border-primary/15`}>
              {project.imgMovil && (
              <button
                type="button"
                className="relative min-h-0 cursor-pointer overflow-hidden group"
                onClick={() => setGalleryIndex(1)}
              >
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-[-100%] animate-[border-glow_5s_linear_infinite]"
                    style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--accent) 85%, transparent 95%)' }}
                  />
                </div>
                <div className="absolute inset-[2px] z-10 overflow-hidden">
                  <Image
                    unoptimized
                    src={project.imgMovil}
                    alt={`${project.title} — mobile`}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                    sizes="25vw"
                  />
                </div>
              </button>
              )}

              {project.imgMedium && (
              <button
                type="button"
                className={`relative min-h-0 ${project.imgMovil ? "border-t border-primary/15" : ""} cursor-pointer overflow-hidden group`}
                onClick={() => setGalleryIndex(project.imgMovil ? 2 : 1)}
              >
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-[-100%] animate-[border-glow_5s_linear_infinite]"
                    style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--accent) 85%, transparent 95%)' }}
                  />
                </div>
                <div className="absolute inset-[2px] z-10 overflow-hidden">
                  <Image
                    unoptimized
                    src={project.imgMedium}
                    alt={`${project.title} — medium`}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                    sizes="25vw"
                  />
                </div>
              </button>
              )}
            </div>
            )}
          </div>

        {/* Info row — wide description | narrow metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-[60fr_40fr] border-t border-primary/15 shrink-0">
          <div className="px-4 py-3 flex flex-col gap-1.5 overflow-y-auto">
            <h3 className="font-medium text-foreground text-base 2xl:text-lg text-wrap-balance">{project.title}</h3>
            <p className="text-sm 2xl:text-base text-foreground/60 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          <div className="sm:border-l sm:border-primary/15 flex flex-col">
            {/* Stack */}
            <div className="px-4 py-3">
              <span className="uppercase tracking-widest text-foreground/30 text-xs">Stack</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-primary/20 px-1.5 py-0.5 text-foreground/50 font-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata rows */}
            <div className="border-t border-primary/15 px-4 py-2 flex flex-col text-xs">
              {([
                ["Year", String(project.year)],
                ["Role", project.role],
                ["Status", project.status],
              ] as const).map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex justify-between py-1.5 ${i > 0 ? "border-t border-primary/10" : ""}`}
                >
                  <span className="uppercase tracking-widest text-foreground/30">{label}</span>
                  <span className="text-foreground/50">{value}</span>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="border-t border-primary/15 px-4 py-3 mt-auto flex items-center justify-between text-sm">
              <span className="uppercase tracking-widest text-foreground/30 text-xs">Links</span>
              <div className="flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors"
                >
                  [ Live ]
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors"
                >
                  [ Repo ]
                </a>
              )}
              </div>
            </div>
          </div>
        </div>
        </m.div>
      </AnimatePresence>
    </>
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
  return (
    <nav aria-label="Project list" className="flex flex-col gap-0.5">
      {projects.map((project, index) => {
        const isActive = project.slug === activeSlug;
        return (
          <button
            key={project.slug}
            onClick={() => onSelect(project.slug)}
            aria-current={isActive ? "true" : undefined}
            className={`flex items-center gap-2 px-3 py-2 text-left ${isActive ? "cursor-default" : "cursor-pointer"} transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${
              isActive
                ? "bg-primary/10 border-l-2 border-l-state-active text-foreground translate-x-1"
                : "border-l-2 border-l-transparent text-foreground/50 hover:text-foreground/80 hover:bg-primary/5 hover:translate-x-1 hover:border-l-primary/40"
            }`}
          >
            <span className="text-xs 2xl:text-sm text-primary/70 shrink-0 font-light">
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
  const ready = useBackgroundReady();
  const hasHover = useHasHover();
  const prefersReduced = useReducedMotion();

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
        <AnimatedPanel title="Projects" className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
          <div className="min-h-full flex items-center justify-center">
            <p className="text-sm text-foreground/50">No projects yet.</p>
          </div>
        </AnimatedPanel>
      </section>
    );
  }

  const content = (
    <div className="grid sm:grid-cols-[12rem_1fr] w-full h-full">
      {/* Navigation sidebar */}
      <div className="sm:border-r sm:border-primary/15 py-2">
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </div>

      {/* Main content — preview top, info row bottom */}
      <div className="flex flex-col min-h-0 overflow-hidden">
        {activeProject && <ProjectPreview project={activeProject} />}
      </div>
    </div>
  );

  const staggeredContent = (
    <m.div
      className="grid sm:grid-cols-[12rem_1fr] w-full h-full"
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      {/* Navigation sidebar */}
      <m.div
        className="sm:border-r sm:border-primary/15 py-2"
        variants={prefersReduced ? reducedItemVariants : itemVariants}
      >
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </m.div>

      {/* Main content — preview top, info row bottom */}
      <m.div
        className="flex flex-col min-h-0 overflow-hidden"
        variants={prefersReduced ? reducedItemVariants : itemVariants}
      >
        {activeProject && <ProjectPreview project={activeProject} />}
      </m.div>
    </m.div>
  );

  return (
    <section
      id="projects"
      className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
      style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
    >
      <AnimatedPanel title="Projects" className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
        <div className="h-full flex items-start justify-center">
          {hasHover ? (
            staggeredContent
          ) : (
            <div className="w-full transition-opacity duration-300" style={{ opacity: ready ? 1 : 0 }}>
              {content}
            </div>
          )}
        </div>
      </AnimatedPanel>
    </section>
  );
}
