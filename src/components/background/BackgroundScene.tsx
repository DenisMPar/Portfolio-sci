'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleCloud } from './ParticleCloud';
import { LiquidSmoke } from './LiquidSmoke';
import { AnalogDecay } from './effects/AnalogDecay';
import { useWebGLGuard } from './hooks/useWebGLGuard';

function WebGLGuard() {
  useWebGLGuard();
  return null;
}

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 75 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <WebGLGuard />
        <Suspense fallback={null}>
          <LiquidSmoke />
        </Suspense>
        <ParticleCloud />
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
            intensity={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
