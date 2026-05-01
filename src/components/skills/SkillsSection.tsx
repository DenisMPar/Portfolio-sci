"use client";

import { m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { useHasHover } from "@/hooks/useHasHover";
import { skills, exploringSkills, type Skill } from "@/data/skills";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, x: 6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 250 },
  },
};

const reducedChipVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const columnWipeVariants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const columnWipeVerticalVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const reducedColumnVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const barFillVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const, delay: 0.6 },
  },
};

const reducedBarVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const chipClass =
  "inline-flex items-center gap-1.5 text-xs 2xl:text-sm border border-primary/20 px-2 py-0.5 2xl:px-2.5 2xl:py-1 text-foreground/70 font-light transition-all hover:text-foreground hover:border-primary/40 hover:shadow-[0_0_12px_var(--primary-subtle)] cursor-default";

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
  const t = useTranslations("skills");
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-4 pb-4 border-b border-primary/10">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">{t("countLabel")}</span>
        <span className="text-sm text-accent/70 font-bold">{totalSkills}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">{t("experienceLabel")}</span>
        <span className="text-sm text-accent/70 font-bold">{t("experienceValue")}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-foreground/55 uppercase tracking-wider">{t("mainStackLabel")}</span>
        <span className="text-sm text-accent/70 font-bold">{t("mainStackValue")}</span>
      </div>
    </div>
  );
}

function ExploringBar() {
  const prefersReduced = useReducedMotion();
  const t = useTranslations("skills");
  return (
    <div className="px-4 pt-4 border-t border-primary/10">
      <span className="text-xs text-foreground/55 uppercase tracking-wider">
        {t("exploring")}
      </span>
      <m.div
        className="flex flex-wrap gap-1.5 mt-2"
        variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.03, delayChildren: 0.7 } } }}
      >
        {exploringSkills.map((skill) => (
          <m.div key={skill.name} variants={prefersReduced ? undefined : chipVariants}>
            <SkillChip skill={skill} />
          </m.div>
        ))}
      </m.div>
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
  const t = useTranslations("skills");

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
            {t("categoryCount", { count: category.skills.length })}
          </span>
        </div>
        <span
          className="text-[32px] font-bold leading-none select-none"
          style={{ color: "var(--primary-ghost)" }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="h-0.5 w-full rounded-sm"
        style={{ background: "var(--primary-faint)" }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-sm"
          style={{
            width: `${barWidth}%`,
            background:
              "linear-gradient(to right, var(--primary-mid), var(--primary-subtle))",
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
  hasHover,
}: {
  category: (typeof skills)[number];
  index: number;
  hasHover: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const barWidth = Math.round((category.skills.length / maxSkillCount) * 100);
  const wipeVariants = hasHover ? columnWipeVariants : columnWipeVerticalVariants;
  const t = useTranslations("skills");

  return (
    <m.div
      variants={prefersReduced ? reducedColumnVariants : wipeVariants}
      className={`flex flex-col gap-3 px-4 py-2 min-[1920px]:py-6 ${getColumnDividers(index)}`}
    >
      <div className="flex items-start justify-between pb-2 border-b border-primary/15">
        <div>
          <span className="text-sm 2xl:text-base text-primary uppercase tracking-wider font-normal">
            {category.name}
          </span>
          <span className="block text-xs text-accent/70 mt-0.5">
            {t("categoryCount", { count: category.skills.length })}
          </span>
        </div>
        <span
          className="text-[32px] font-bold leading-none select-none"
          style={{ color: "var(--primary-ghost)" }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="h-0.5 w-full rounded-sm"
        style={{ background: "var(--primary-faint)" }}
        aria-hidden="true"
      >
        <m.div
          className="h-full rounded-sm origin-left"
          variants={prefersReduced ? reducedBarVariants : barFillVariants}
          style={{
            width: `${barWidth}%`,
            background: "linear-gradient(to right, var(--primary-mid), var(--primary-subtle))",
          }}
        />
      </div>

      <m.div
        className="flex flex-wrap gap-1.5"
        variants={prefersReduced ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.03, delayChildren: 0.4 } } }}
      >
        {category.skills.map((skill) => (
          <m.div key={skill.name} variants={prefersReduced ? undefined : chipVariants}>
            <SkillChip skill={skill} />
          </m.div>
        ))}
      </m.div>
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

function AnimatedSkillsContent({ hasHover }: { hasHover: boolean }) {
  const prefersReduced = useReducedMotion();
  const wipeVariants = hasHover ? columnWipeVariants : columnWipeVerticalVariants;

  return (
    <m.div
      className="flex flex-col w-full"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <m.div variants={prefersReduced ? reducedColumnVariants : wipeVariants}>
        <StatsBar />
      </m.div>
      <m.div variants={gridVariants} className="grid grid-cols-1 md:grid-cols-2 w-full">
        {skills.map((category, i) => (
          <AnimatedCategoryColumn key={category.name} category={category} index={i} hasHover={hasHover} />
        ))}
      </m.div>
      <m.div variants={prefersReduced ? reducedColumnVariants : wipeVariants}>
        <ExploringBar />
      </m.div>
    </m.div>
  );
}

export function SkillsSection() {
  const hasHover = useHasHover();
  const t = useTranslations("skills");
  return (
    <section
      id="skills"
      className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none"
      style={{ paddingTop: "var(--section-pt)", paddingBottom: "var(--section-pb)" }}
    >
      <AnimatedPanel title={t("panelTitle")} className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh] pointer-events-auto">
        <div className="h-full flex items-center">
          <AnimatedSkillsContent hasHover={hasHover} />
        </div>
      </AnimatedPanel>
    </section>
  );
}
