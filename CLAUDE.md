# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

Next.js 16 App Router project with React 19, TypeScript, and Tailwind CSS v4.

### Key files

- `src/app/layout.tsx` — Root layout; sets fonts (Geist Sans + Geist Mono via `next/font/google`), renders `<BackgroundClient />` behind all pages
- `src/app/page.tsx` — Home page; renders `<HeroSection />`
- `src/app/globals.css` — Global styles; Tailwind base entry point
- `next.config.ts` — Next.js config (empty defaults)

### Components

- `src/components/hero/HeroSection.tsx` — Hero section (Server Component): name + title
- `src/components/background/BackgroundClient.tsx` — Client wrapper for the 3D background scene
- `src/components/background/BackgroundScene.tsx` — Three.js scene setup
- `src/components/background/ParticleCloud.tsx` — Particle cloud mesh (react-three-fiber)
- `src/components/background/LiquidSmoke.tsx` — Liquid smoke effect
- `src/components/background/effects/AnalogDecay.tsx` — Post-processing effect
- `src/components/background/hooks/useMouseUniform.ts` — Mouse position uniform hook
- `src/components/background/hooks/useWebGLGuard.ts` — WebGL availability guard
- `src/components/background/utils/fibonacciSphere.ts` — Fibonacci sphere point distribution

### Dependencies

- **three** + **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** — 3D background scene

### Conventions

- Prefer Server Components by default; only add `'use client'` when hooks/interactivity are needed
- **Tailwind CSS v4** — configured via PostCSS (`@tailwindcss/postcss`), not a `tailwind.config.js`. Dark mode via CSS media queries
- Path alias `@/*` maps to `src/*`
- Static assets in `public/` (currently: `noise.png`)
