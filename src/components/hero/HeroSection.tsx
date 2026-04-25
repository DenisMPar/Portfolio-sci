"use client";

import Link from "next/link";
import { AnimatedPanel } from "../panel/AnimatedPanel";

export function HeroSection() {
  return (
    <section id="hero" className="relative z-10 h-screen w-full flex flex-col items-center justify-center pointer-events-none" style={{ paddingTop: 'var(--section-pt)', paddingBottom: 'var(--section-pb)' }}>
      <AnimatedPanel className="w-[90vw] max-w-[1500px] h-full min-[1920px]:h-[70vh]">
        <div className="flex flex-col items-center justify-center h-full text-center pointer-events-auto select-text">
        <h1
          className="text-5xl font-bold sm:text-7xl font-display text-foreground"
          style={{ letterSpacing: '-0.04em' }}
        >
          DENIS
        </h1>
        <p
          className="mt-4 text-xl sm:text-2xl font-medium tracking-tight text-accent"
        >
          Frontend Engineer
        </p>
        <div className="mt-8 max-w-2xl text-base sm:text-[17px] leading-relaxed space-y-4 text-foreground/80 font-light">
          <p>
            I&apos;m a frontend engineer who enjoys building performant web
            applications and exploring the intersection of design and
            engineering.
          </p>
          <p>
            I focus on crafting polished{" "}
            <span className="text-foreground font-medium">React</span> interfaces with attention
            to detail and performance. I care about clean code, developer
            experience, and shipping things that actually work.
          </p>
        </div>
        <Link
          href="/projects"
          className="mt-10 inline-flex items-center gap-2 border border-accent/40 px-6 py-3 text-sm font-mono text-accent tracking-wider uppercase hover:bg-accent/10 hover:border-accent/70 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
        >
          View projects
          <span aria-hidden="true">&rarr;</span>
        </Link>
        </div>
      </AnimatedPanel>
    </section>
  );
}
