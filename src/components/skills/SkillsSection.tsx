"use client";

import { InterfacePanel } from "../panel";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { AnimatedCardGrid, AnimatedCard } from "../panel/AnimatedCardGrid";
import { skills } from "@/data/skills";

export function SkillsSection() {
  return (
    <section id="skills" className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none" style={{ paddingTop: 'var(--section-pt)', paddingBottom: 'var(--section-pb)' }}>
      <AnimatedPanel title="Skills" className="w-[90vw] h-full pointer-events-auto">
        <div className="min-h-full flex items-center justify-center">
        <AnimatedCardGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
          {skills.map((category) => (
            <AnimatedCard key={category.name}>
              <InterfacePanel title={category.name} variant="card" className="h-full">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs border border-primary/30 px-2 py-1 text-foreground/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </InterfacePanel>
            </AnimatedCard>
          ))}
        </AnimatedCardGrid>
        </div>
      </AnimatedPanel>
    </section>
  );
}
