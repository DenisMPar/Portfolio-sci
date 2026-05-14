"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@/data/projects";

export function ProjectNav({
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
            onClick={(e) => { onSelect(project.slug); (e.currentTarget as HTMLButtonElement).blur(); }}
            aria-current={isActive ? "true" : undefined}
            className={`shrink-0 sm:shrink flex items-center gap-2 px-2.5 sm:px-3 py-2 text-left ${isActive ? "cursor-default" : "cursor-pointer"} transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${
              isActive
                ? "bg-primary/10 border-b-2 sm:border-b-0 border-b-state-active sm:border-l-2 sm:border-l-state-active text-foreground sm:translate-x-1"
                : "border-b-2 sm:border-b-0 border-b-transparent sm:border-l-2 sm:border-l-transparent text-foreground/55 pointer-hover:text-foreground/80 pointer-hover:bg-primary/5 sm:pointer-hover:translate-x-1 sm:pointer-hover:border-l-primary/40"
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
