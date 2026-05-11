"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { useHasHover } from "@/hooks/useHasHover";
import type { Project } from "@/data/projects";
import { Gallery } from "./Gallery";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectInfoRow } from "./ProjectInfoRow";
import { ProjectSections } from "./ProjectSections";
import { ProjectNav } from "./ProjectNav";

type MotionTarget = TargetAndTransition;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, transform: "translateX(-10px)" },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 250 },
  },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// ── ProjectPreview ────────────────────────────────────────────────────────────

function ProjectPreview({ project, hasHover }: { project: Project; hasHover: boolean }) {
  const prefersReduced = useReducedMotion();
  const clipInitial: MotionTarget = prefersReduced
    ? { opacity: 0 }
    : { clipPath: hasHover ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)" };
  const clipVisible: MotionTarget = prefersReduced
    ? { opacity: 1 }
    : { clipPath: "inset(0 0% 0 0)" };

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

  const prevImage = useCallback(() => {
    setCarouselIndex((i) => (i - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  const nextImage = useCallback(() => {
    setCarouselIndex((i) => (i + 1) % project.images.length);
  }, [project.images.length]);

  const hasSections = project.sections.length > 0;

  return (
    <div className="relative flex flex-col lg:flex-1 lg:min-h-0">
      {mounted && createPortal(
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
          exit={prefersReduced
            ? { opacity: 0 }
            : { clipPath: hasHover ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)", transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }
          }
          transition={{ duration: 0.15 }}
          className="flex flex-col lg:flex-1 lg:min-h-0"
        >
          <div className={`flex flex-col lg:grid ${hasSections ? "lg:grid-cols-[55fr_45fr]" : ""} lg:grid-rows-[1fr_auto] lg:flex-1 lg:min-h-0 lg:overflow-hidden`}>
            {project.images.length > 0 && (
              <ProjectCarousel
                images={project.images}
                title={project.title}
                activeIndex={carouselIndex}
                hasMultiple={project.images.length > 1}
                clipInitial={clipInitial}
                clipVisible={clipVisible}
                prefersReduced={prefersReduced}
                onPrev={prevImage}
                onNext={nextImage}
                onSelectIndex={setCarouselIndex}
                onOpen={() => setGalleryIndex(carouselIndex)}
              />
            )}
            <ProjectInfoRow
              project={project}
              clipInitial={clipInitial}
              clipVisible={clipVisible}
              prefersReduced={prefersReduced}
            />
            {hasSections && (
              <ProjectSections
                sections={project.sections}
                clipInitial={clipInitial}
                clipVisible={clipVisible}
                prefersReduced={prefersReduced}
              />
            )}
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}

// ── ProjectsSection ───────────────────────────────────────────────────────────

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
