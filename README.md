# Portfolio — Denis Parada

Personal portfolio built as a single-page-per-route experience around a custom WebGL background. The focus is craft: hand-written GLSL, motion that respects the user, and a 3D scene that degrades gracefully instead of being switched off.

**Live:** https://denisparportfolio.vercel.app

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (PostCSS, no config file; dark theme via CSS variables)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing**
- **Framer Motion** (spring-based UI motion)
- **next-intl** (English / Spanish, locale-prefixed routes)
- **Contentful** (projects content)

## Technical highlights

### Custom GLSL shaders

Three effects, all written by hand rather than pulled from a library:

- **`ParticleCloud` — mouse wake.** 2000 points distributed on a Fibonacci sphere, rendered as additive point sprites with a core+glow falloff in the fragment shader. The "wake" is driven from the CPU: the pointer is raycast against the sphere's bounding volume, and the last 8 hit points are pushed into a trail uniform. The vertex shader pulls nearby particles toward those trail points with an exponential distance falloff, so the cloud parts around the cursor and settles back as the trail decays. The cloud also rotates continuously, independent of input.

- **`LiquidSmoke` — render to FBO.** A 3-layer domain-warped noise field (sampling a single tiled noise texture) is rendered to an off-screen framebuffer at **half resolution**, then composited additively onto a large background plane. Keeping the smoke in its own FBO decouples its cost from the rest of the scene and keeps the expensive fragment work at a fraction of the canvas pixels. Depth, stencil, and mipmaps are all disabled on the target.

- **`AnalogDecay` — postprocessing pass.** A custom `postprocessing` `Effect` that layers chromatic aberration, film grain, scanlines, sub-pixel jitter, vignette, and a cool-blue color grade in a single branchless fragment shader. Runs after a `Bloom` pass via `EffectComposer`.

### Performance strategy

- **Deferred mount.** The background is gated behind a WebGL probe and only mounts after first paint, then fades in — the canvas never blocks initial render.
- **`dynamic(..., { ssr: false })`.** The entire Three.js bundle is client-only and excluded from the server render.
- **Adaptive pixel ratio.** DPR is capped at `[1, 1.5]` on desktop and `[1, 1]` on touch devices, where fill-rate is the bottleneck. R3F's adaptive performance scaling is enabled (`min: 0.5`).
- **Half-resolution FBO** for the smoke pass (see above).
- **Context-loss handling.** A guard listens for `webglcontextlost` / `webglcontextrestored` and re-invalidates the frame loop on restore and on tab re-focus, so the scene recovers instead of going black.

### Accessibility & graceful degradation

- **`prefers-reduced-motion`** is honored everywhere: the entire background is skipped, and UI entrance animations fall back to a plain opacity fade. Decorative CSS animations (glitch, typing cursor) are disabled.
- **Touch devices keep the scene.** Instead of dropping all 3D on mobile, the cloud degrades to rotation-only (no raycasting, no pointer trail) and the heavy postprocessing pass is skipped — so a phone still gets the smoke and particles, just cheaper.
- **WebGL guard.** If WebGL is unavailable, the probe fails closed and the site renders normally without the canvas.

## Project structure

```
src/
  app/[locale]/         App Router pages (home, projects, skills, explore) + error/not-found
  components/
    background/         WebGL scene: ParticleCloud, LiquidSmoke, AnalogDecay, guards, hooks
    panel/              InterfacePanel — the retro-terminal UI shell (CRT, scanlines, clip-path)
    hero/ projects/ skills/ nav/ footer/
  data/                 Static skills data + Project types
  lib/                  Contentful client, utilities
  i18n/                 next-intl routing & navigation
```
