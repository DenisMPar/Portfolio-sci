"use client";

import { AnimatedPanel } from "../panel/AnimatedPanel";

export function HeroSection() {
  return (
    <section id="hero" className="relative z-10 h-screen w-full flex flex-col items-center justify-center pointer-events-none select-none" style={{ paddingTop: 'var(--section-pt)', paddingBottom: 'var(--section-pb)' }}>
      <AnimatedPanel title="Main" className="w-[90vw] max-w-[1500px] h-full">
        <div className="flex flex-col items-center justify-center h-full text-center">
        <h1
          className="text-5xl font-bold tracking-tight sm:text-7xl"
          style={{ color: '#eaeaea' }}
        >
          Denis
        </h1>
        <p
          className="mt-4 text-lg sm:text-2xl font-mono"
          style={{ color: '#00ff88' }}
        >
          Frontend Engineer
        </p>
        <div className="mt-8 max-w-2xl font-mono text-sm sm:text-base leading-relaxed space-y-4 text-foreground/80">
          <p>
            I&apos;m a frontend engineer who enjoys building performant web
            applications and exploring the intersection of design and
            engineering.
          </p>
          <p>
            I focus on crafting polished{" "}
            <span className="text-accent">React</span> interfaces with attention
            to detail and performance. I care about clean code, developer
            experience, and shipping things that actually work.
          </p>
        </div>
        </div>
      </AnimatedPanel>
    </section>
  );
}
