import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import type { CaseStudyProject } from "@/data/projects";

export function CaseStudyPreview({ project }: { project: CaseStudyProject }) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={project.slug}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={
          prefersReduced
            ? { duration: 0.15 }
            : { type: "spring", damping: 25, stiffness: 250 }
        }
        className="flex flex-col h-full"
      >
        {/* Case study content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {project.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs uppercase tracking-widest text-primary/70 font-display mb-1.5">
                {section.title}
              </h4>
              <p className="text-sm 2xl:text-base text-foreground/70 leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Info row — same structure as showcase projects */}
        <div className="grid grid-cols-1 sm:grid-cols-[60fr_40fr] border-t border-primary/15 shrink-0">
          <div className="px-4 py-3 flex flex-col gap-1.5 overflow-y-auto">
            <h3 className="font-medium text-foreground text-base 2xl:text-lg text-wrap-balance">
              {project.title}
            </h3>
            <p className="text-sm 2xl:text-base text-foreground/60 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          <div className="sm:border-l sm:border-primary/15 flex flex-col">
            {/* Stack */}
            <div className="px-4 py-3">
              <span className="uppercase tracking-widest text-foreground/30 text-xs">
                Stack
              </span>
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
              {(
                [
                  ["Year", String(project.year)],
                  ["Role", project.role],
                  ["Type", "Case Study"],
                ] as const
              ).map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex justify-between py-1.5 ${i > 0 ? "border-t border-primary/10" : ""}`}
                >
                  <span className="uppercase tracking-widest text-foreground/30">
                    {label}
                  </span>
                  <span className="text-foreground/50">{value}</span>
                </div>
              ))}
            </div>

            {/* Links */}
            {(project.liveUrl || project.repoUrl) && (
              <div className="border-t border-primary/15 px-4 py-3 mt-auto flex items-center justify-between text-sm">
                <span className="uppercase tracking-widest text-foreground/30 text-xs">
                  Links
                </span>
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
            )}
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
