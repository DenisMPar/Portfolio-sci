"use client";

import { m, useReducedMotion } from "framer-motion";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { useBackgroundReady } from "@/components/background/BackgroundReadyContext";
import { useHasHover } from "@/hooks/useHasHover";
import { skills, exploringSkills, type Skill } from "@/data/skills";

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
  "inline-flex items-center gap-1.5 text-xs 2xl:text-sm border border-primary/20 px-2 py-0.5 2xl:px-2.5 2xl:py-1 text-foreground/70 font-light transition-all hover:text-foreground hover:border-primary/40 hover:shadow-[0_0_12px_rgba(80,140,204,0.15)] cursor-default";

function SkillChip({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <span className={chipClass}>
      {Icon && <Icon className="size-3.5 2xl:size-4 text-primary/50" />}
      {skill.name}
    </span>
  );
}

const maxSkillCount = Math.max(...skills.map((c) => c.skills.length));
const totalSkills = skills.reduce((sum, c) => sum + c.skills.length, 0);

const contentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

function StatsBar() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-4 pb-4 border-b border-primary/10">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">skills:</span>
        <span className="text-sm text-accent/70 font-bold">{totalSkills}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">experience:</span>
        <span className="text-sm text-accent/70 font-bold">+3 yrs</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">main stack:</span>
        <span className="text-sm text-accent/70 font-bold">Next.js · React · TypeScript</span>
      </div>
    </div>
  );
}

function ExploringBar() {
  return (
    <div className="px-4 pt-4 border-t border-primary/10">
      <span className="text-xs text-foreground/55 uppercase tracking-wider">
        Exploring & Improving
      </span>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {exploringSkills.map((skill) => (
          <SkillChip key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function getColumnDividers(index: number): string {
  const last = skills.length - 1;
  if (index === last) return "";

  const classes = ["border-primary/10"];

  classes.push("border-b");
  if (index >= 2) classes.push("md:border-b-0");

  if (index % 2 === 0) classes.push("md:border-r");

  return classes.join(" ");
}

function CategoryColumn({
  category,
  index,
}: {
  category: (typeof skills)[number];
  index: number;
}) {
  const barWidth = Math.round((category.skills.length / maxSkillCount) * 100);

  return (
    <div
      className={`flex flex-col gap-3 px-4 py-2 min-[1920px]:py-6 ${getColumnDividers(index)}`}
    >
      <div className="flex items-start justify-between pb-2 border-b border-primary/15">
        <div>
          <span className="text-sm 2xl:text-base text-primary uppercase tracking-wider font-normal">
            {category.name}
          </span>
          <span className="block text-xs text-accent/70 mt-0.5">
            {category.skills.length} skills
          </span>
        </div>
        <span
          className="text-[32px] font-bold leading-none select-none"
          style={{ color: "rgba(80,140,204,0.07)" }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="h-0.5 w-full rounded-sm"
        style={{ background: "rgba(80,140,204,0.08)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-sm"
          style={{
            width: `${barWidth}%`,
            background:
              "linear-gradient(to right, rgba(80,140,204,0.55), rgba(80,140,204,0.15))",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {category.skills.map((skill) => (
          <SkillChip key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function AnimatedCategoryColumn({
  category,
  index,
}: {
  category: (typeof skills)[number];
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? reducedChipVariants : chipVariants;
  const barWidth = Math.round((category.skills.length / maxSkillCount) * 100);

  return (
    <m.div
      variants={categoryVariants}
      className={`flex flex-col gap-3 px-4 py-2 min-[1920px]:py-6 ${getColumnDividers(index)}`}
    >
      <div className="flex items-start justify-between pb-2 border-b border-primary/15">
        <div>
          <m.span
            variants={variants}
            className="text-sm 2xl:text-base text-primary uppercase tracking-wider font-normal"
          >
            {category.name}
          </m.span>
          <span className="block text-xs text-accent/70 mt-0.5">
            {category.skills.length} skills
          </span>
        </div>
        <span
          className="text-[32px] font-bold leading-none select-none"
          style={{ color: "rgba(80,140,204,0.07)" }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="h-0.5 w-full rounded-sm"
        style={{ background: "rgba(80,140,204,0.08)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-sm"
          style={{
            width: `${barWidth}%`,
            background:
              "linear-gradient(to right, rgba(80,140,204,0.55), rgba(80,140,204,0.15))",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {category.skills.map((skill) => (
          <m.div key={skill.name} variants={variants}>
            <SkillChip skill={skill} />
          </m.div>
        ))}
      </div>
    </m.div>
  );
}

function SkillsContent() {
  return (
    <div className="flex flex-col justify-evenly h-full w-full">
      <StatsBar />
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        {skills.map((category, i) => (
          <CategoryColumn key={category.name} category={category} index={i} />
        ))}
      </div>
      <ExploringBar />
    </div>
  );
}

function AnimatedSkillsContent() {
  const ready = useBackgroundReady();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? reducedChipVariants : chipVariants;

  return (
    <m.div
      className="flex flex-col w-full"
      variants={contentVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
    >
      <m.div variants={variants}>
        <StatsBar />
      </m.div>
      <m.div variants={gridVariants} className="grid grid-cols-1 md:grid-cols-2 w-full">
        {skills.map((category, i) => (
          <AnimatedCategoryColumn key={category.name} category={category} index={i} />
        ))}
      </m.div>
      <m.div variants={variants}>
        <ExploringBar />
      </m.div>
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
      <AnimatedPanel title="Skills" className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
        <div className="h-full flex items-center">
          {hasHover ? (
            <AnimatedSkillsContent />
          ) : (
            <div className="w-full transition-opacity duration-300" style={{ opacity: ready ? 1 : 0 }}>
              <SkillsContent />
            </div>
          )}
        </div>
      </AnimatedPanel>
    </section>
  );
}
