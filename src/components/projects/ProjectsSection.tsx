"use client";

import Image from "next/image";
import { InterfacePanel } from "../panel";
import { AnimatedPanel } from "../panel/AnimatedPanel";
import { AnimatedCardGrid, AnimatedCard } from "../panel/AnimatedCardGrid";
import type { Project } from "@/data/projects";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative z-10 h-screen w-full flex items-center justify-center pointer-events-none" style={{ paddingTop: 'var(--section-pt)', paddingBottom: 'var(--section-pb)' }}>
      <AnimatedPanel title="Projects" className="w-[90vw] h-full pointer-events-auto">
        <div className="min-h-full flex items-center justify-center">
        <AnimatedCardGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
          {projects.map((project) => (
            <AnimatedCard key={project.slug}>
              <InterfacePanel variant="card" className="h-full">
                <div className="flex flex-col h-full">
                <div className="relative w-full aspect-video mb-3 overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{project.title}</h4>
                <p className="font-mono text-xs text-foreground/60 mb-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs border border-primary/30 px-2 py-1 text-foreground/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 font-mono text-xs">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto text-accent hover:text-accent/80 transition-colors"
                    >
                      [ Live ]
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto text-primary hover:text-primary/80 transition-colors"
                    >
                      [ Repo ]
                    </a>
                  )}
                </div>
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
