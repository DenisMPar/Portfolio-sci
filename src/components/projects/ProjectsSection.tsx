"use client";

import { useState, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
import { useHasHover } from "@/hooks/useHasHover";
import type { Project } from "@/data/projects";

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

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={project.slug}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={prefersReduced ? { duration: 0.15 } : { type: "spring", damping: 25, stiffness: 250 }}
        className="flex flex-col h-full"
      >
        <div
          className="relative w-full max-w-xl aspect-video max-h-[30vh] mb-4"
          style={{
            clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <div className="absolute inset-0 bg-primary/20" />
          <div className="absolute inset-px overflow-hidden" style={{
            clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
          }}>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 60vw"
            />
          </div>
        </div>

        <h3 className="font-medium text-foreground mb-1 text-base 2xl:text-lg text-wrap-balance">{project.title}</h3>

        <p className="text-sm 2xl:text-base text-foreground/60 leading-relaxed mb-3 font-light">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs 2xl:text-sm border border-primary/20 px-1.5 2xl:px-2 py-0.5 text-foreground/50 font-light"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 text-sm 2xl:text-base">
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
      </m.div>
    </AnimatePresence>
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
        <AnimatedPanel title="Projects" className="w-[90vw] max-w-[1500px] h-full pointer-events-auto">
          <div className="min-h-full flex items-center justify-center">
            <p className="text-sm text-foreground/50">No projects yet.</p>
          </div>
        </AnimatedPanel>
      </section>
    );
  }

  const content = (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl h-full">
      {/* Navigation list */}
      <div className="sm:w-48 shrink-0 sm:border-r sm:border-primary/15 sm:pr-4">
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </div>

      {/* Preview area */}
      <div className="flex-1 min-w-0">
        {activeProject && <ProjectPreview project={activeProject} />}
      </div>
    </div>
  );

  const staggeredContent = (
    <m.div
      className="flex flex-col sm:flex-row gap-4 w-full max-w-5xl h-full"
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      {/* Navigation list */}
      <m.div
        className="sm:w-48 shrink-0 sm:border-r sm:border-primary/15 sm:pr-4"
        variants={prefersReduced ? reducedItemVariants : itemVariants}
      >
        <ProjectNav projects={projects} activeSlug={activeSlug} onSelect={selectProject} />
      </m.div>

      {/* Preview area */}
      <m.div
        className="flex-1 min-w-0"
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
      <AnimatedPanel title="Projects" className="w-[90vw] max-w-[1500px] h-full pointer-events-auto">
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
