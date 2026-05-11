"use client";

import { m } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Project } from "@/data/projects";

type MotionTarget = TargetAndTransition;

const metaRowVariants = {
  hidden: { opacity: 0, transform: "translateX(-6px)" },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

export function ProjectInfoRow({
  project,
  clipInitial,
  clipVisible,
  prefersReduced,
}: {
  project: Project;
  clipInitial: MotionTarget;
  clipVisible: MotionTarget;
  prefersReduced: boolean | null;
}) {
  const t = useTranslations("projects");
  return (
    <div className="shrink-0 lg:col-span-2 lg:row-start-2">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left motion-reduce:!animate-none"
          style={{ transform: 'scaleX(0)', animation: 'line-expand 0.5s ease-out 0.15s forwards' }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr]">
        <m.div
          className="px-4 py-3 flex flex-col gap-1.5 overflow-y-auto"
          initial={clipInitial}
          animate={clipVisible}
          transition={prefersReduced ? { duration: 0.15 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <m.h2
            className="glitch font-medium text-foreground text-base 2xl:text-lg text-wrap-balance"
            data-text={project.title}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, transform: "translateX(-6px)" }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, transform: "translateX(0px)" }}
            transition={prefersReduced ? { duration: 0.15 } : { duration: 0.25, ease: "easeOut", delay: 0.2 }}
          >
            {project.title}
          </m.h2>
          <m.p
            className="text-sm 2xl:text-base text-foreground/60 leading-relaxed font-light"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, transform: "translateX(-6px)" }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, transform: "translateX(0px)" }}
            transition={prefersReduced ? { duration: 0.15 } : { duration: 0.4, ease: "easeOut", delay: 0.38 }}
          >
            {project.description}
          </m.p>
        </m.div>

        <m.div
          className="lg:border-l lg:border-primary/15 flex flex-col"
          initial={clipInitial}
          animate={clipVisible}
          transition={prefersReduced ? { duration: 0.15 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="grid grid-cols-2 text-xs h-full">
            <m.div
              className="px-4 py-3"
              variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } } }}
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
              variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
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
                  className="flex justify-between items-start py-1.5 border-t border-primary/10"
                  variants={prefersReduced ? undefined : metaRowVariants}
                >
                  <span className="uppercase tracking-widest text-foreground/55">{t("links")}</span>
                  <div className="flex flex-col items-start gap-1">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent pointer-hover:text-accent/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors text-sm"
                      >
                        [ {t("live")} ]
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary pointer-hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none transition-colors text-sm"
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
  );
}
