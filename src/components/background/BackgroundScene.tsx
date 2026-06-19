'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleCloud } from './ParticleCloud';
import { LiquidSmoke } from './LiquidSmoke';
import { AnalogDecay } from './effects/AnalogDecay';
import { useWebGLGuard } from './hooks/useWebGLGuard';
import { useHasHover } from '@/hooks/useHasHover';

const CAMERA = { position: [0, 0, 16] as const, fov: 75 };
const GL = { alpha: true, antialias: false };
const DPR: [number, number] = [1, 1.5];
// Touch GPUs are fill-rate bound: cap the pixel ratio so the full-screen
// smoke/particle passes stay cheap without postprocessing.
const DPR_MOBILE: [number, number] = [1, 1];
const PERF = { min: 0.5 };

function WebGLGuard() {
  useWebGLGuard();
  return null;
}

export function BackgroundScene() {
  const hasHover = useHasHover();

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        camera={CAMERA}
        dpr={hasHover ? DPR : DPR_MOBILE}
        performance={PERF}
        gl={GL}
        style={{ width: '100%', height: '100%' }}
        eventSource={typeof document !== 'undefined' ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <WebGLGuard />
        <Suspense fallback={null}>
          <LiquidSmoke />
        </Suspense>
        <ParticleCloud />
        {hasHover && (
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.0}
              luminanceSmoothing={1.25}
              mipmapBlur
            />
            <AnalogDecay
              grain={0.1}
              bleeding={0.3}
              scanlines={0.15}
              vignette={1.0}
              jitter={0.4}
              intensity={0.2}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
