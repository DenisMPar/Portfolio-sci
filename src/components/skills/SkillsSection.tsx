import { InterfacePanel } from "../panel";
import { skills } from "@/data/skills";

export function SkillsSection() {
  return (
    <section id="skills" className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none" style={{ paddingTop: 'var(--section-pt)', paddingBottom: 'var(--section-pb)' }}>
      <InterfacePanel title="Skills" className="w-[90vw] h-full">
        <div className="flex items-center justify-center h-full">
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl [&>*]:w-full [&>*]:sm:w-[calc(50%-0.5rem)] [&>*]:lg:w-[calc(33.333%-0.75rem)]">
          {skills.map((category) => (
            <InterfacePanel key={category.name} title={category.name} variant="card">
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
          ))}
        </div>
        </div>
      </InterfacePanel>
    </section>
  );
}
