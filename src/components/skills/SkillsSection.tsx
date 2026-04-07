"use client";

import { m, useReducedMotion } from "framer-motion";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
import { useHasHover } from "@/hooks/useHasHover";
import { skills, type Skill } from "@/data/skills";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const categoryVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 250 },
  },
};

const reducedChipVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const chipClass =
  "inline-flex items-center gap-1.5 font-mono text-xs 2xl:text-sm border border-primary/20 px-2.5 py-1 2xl:px-3 2xl:py-1.5 text-foreground/70 transition-all hover:text-foreground hover:border-primary/40 hover:shadow-[0_0_12px_rgba(80,140,200,0.15)] cursor-default";

function SkillChip({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <span className={chipClass}>
      {Icon && <Icon className="size-3.5 2xl:size-4 text-primary/50" />}
      {skill.name}
    </span>
  );
}

function CategoryRow({ category, isLast }: { category: (typeof skills)[number]; isLast: boolean }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 py-5 px-2">
        <span className="font-mono text-[10px] 2xl:text-xs text-primary/70 uppercase tracking-wider sm:w-40 2xl:w-44 shrink-0">
          {category.name}
          <span className="text-accent/40 ml-2">({category.skills.length})</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <SkillChip key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
      {!isLast && (
        <div className="h-px bg-gradient-to-r from-primary/15 via-primary/10 to-transparent" aria-hidden="true" />
      )}
    </div>
  );
}

function AnimatedCategoryRow({ category, isLast }: { category: (typeof skills)[number]; isLast: boolean }) {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? reducedChipVariants : chipVariants;

  return (
    <m.div variants={categoryVariants}>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 py-5 px-2">
        <m.span className="font-mono text-[10px] 2xl:text-xs text-primary/70 uppercase tracking-wider sm:w-40 2xl:w-44 shrink-0" variants={variants}>
          {category.name}
          <span className="text-accent/40 ml-2">({category.skills.length})</span>
        </m.span>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <m.div key={skill.name} variants={variants}>
              <SkillChip skill={skill} />
            </m.div>
          ))}
        </div>
      </div>
      {!isLast && (
        <div className="h-px bg-gradient-to-r from-primary/15 via-primary/10 to-transparent" aria-hidden="true" />
      )}
    </m.div>
  );
}

function SkillRows() {
  return (
    <div className="flex flex-col w-full max-w-5xl">
      {skills.map((category, i) => (
        <CategoryRow key={category.name} category={category} isLast={i === skills.length - 1} />
      ))}
    </div>
  );
}

function AnimatedSkillRows() {
  const ready = useBackgroundReady();

  return (
    <m.div
      className="flex flex-col w-full max-w-5xl"
      variants={gridVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      {skills.map((category, i) => (
        <AnimatedCategoryRow key={category.name} category={category} isLast={i === skills.length - 1} />
      ))}
    </m.div>
  );
}

export function SkillsSection() {
  const ready = useBackgroundReady();
  const hasHover = useHasHover();

  return (
    <section
      id="skills"
      className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none"
      style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
    >
      <AnimatedPanel title="Skills" className="w-[90vw] max-w-[1500px] h-full pointer-events-auto">
        <div className="h-full flex items-center justify-center">
          {hasHover ? (
            <AnimatedSkillRows />
          ) : (
            <div className="w-full transition-opacity duration-300" style={{ opacity: ready ? 1 : 0 }}>
              <SkillRows />
            </div>
          )}
        </div>
      </AnimatedPanel>
    </section>
  );
}
