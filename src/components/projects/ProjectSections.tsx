"use client";

import { m } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import type { Project } from "@/data/projects";

type MotionTarget = TargetAndTransition;

export function ProjectSections({
  sections,
  clipInitial,
  clipVisible,
  prefersReduced,
}: {
  sections: Project["sections"];
  clipInitial: MotionTarget;
  clipVisible: MotionTarget;
  prefersReduced: boolean | null;
}) {
  return (
    <m.div
      className="flex flex-col lg:flex-1 lg:min-h-0 lg:overflow-y-auto px-5 py-4 gap-4 border-t lg:border-t-0 lg:border-l border-primary/15 lg:col-start-2 lg:row-start-1"
      initial={clipInitial}
      animate={clipVisible}
      transition={prefersReduced ? { duration: 0.15 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      {sections.map((section) => (
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
  );
}
