'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Vector3,
  Raycaster,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  AdditiveBlending,
} from 'three';
import { fibonacciSphere } from './utils/fibonacciSphere';
import { useHasHover } from '@/hooks/useHasHover';

const TRAIL_LENGTH = 8;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uTrail[${TRAIL_LENGTH}];
  uniform int uTrailCount;

  void main() {
    float angle = uTime * 0.010;
    float c = cos(angle), s = sin(angle);
    vec3 pos = vec3(c * position.x + s * position.z, position.y, -s * position.x + c * position.z);

    // Pull particles toward mouse trail points (wake effect)
    vec3 displacement = vec3(0.0);
    for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
      if (i >= uTrailCount) break;
      vec3 toTrail = uTrail[i] - pos;
      float dist = length(toTrail);
      float strength = 1.0 - float(i) / float(${TRAIL_LENGTH});
      float pull = strength * 1.2 * exp(-dist * dist * 0.18);
      displacement += normalize(toTrail + 0.001) * pull;
    }
    pos += displacement;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (12.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  void main() {
    float dist = length(gl_PointCoord - 0.5);
    if (dist > 0.5) discard;

    float core = exp(-dist * 8.0);
    float glow = exp(-dist * 3.0) * 0.4;

    float alpha = core + glow;
    vec3 color = vec3(0.22, 0.26, 0.48);
    gl_FragColor = vec4(color, alpha);
  }
`;

const FAR_AWAY = new Vector3(0, 0, -1000);

export function ParticleCloud() {
  const hasHover = useHasHover();
  const positions = useMemo(() => fibonacciSphere(2800, 13.5), []);

  const trailArray = useMemo(
    () => hasHover
      ? Array.from({ length: TRAIL_LENGTH }, () => new Vector3().copy(FAR_AWAY))
      : null,
    [hasHover],
  );
  const trailIndex = useRef(0);
  const trailCount = useRef(0);
  const lastTrailTime = useRef(0);

  const raycaster = useMemo(() => hasHover ? new Raycaster() : null, [hasHover]);
  const sphereGeo = useMemo(() => hasHover ? new SphereGeometry(13.5, 32, 32) : null, [hasHover]);
  const dummyMesh = useMemo(() => {
    if (!hasHover || !sphereGeo) return null;
    const m = new Mesh(sphereGeo, new MeshBasicMaterial());
    m.visible = false;
    return m;
  }, [hasHover, sphereGeo]);

  const uniformsRef = useRef({
    uTime:       { value: 0 },
    uSize:       { value: 0.56 },
    uPixelRatio: { value: 1 },
    uTrail:      { value: Array.from({ length: TRAIL_LENGTH }, () => FAR_AWAY.clone()) },
    uTrailCount: { value: 0 },
  });

  const camera = useThree((s) => s.camera);

  const elapsedRef = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0 });

  useFrame(({ gl, pointer }, delta) => {
    elapsedRef.current += delta;
    const t = elapsedRef.current;
    uniformsRef.current.uTime.value       = t;
    uniformsRef.current.uPixelRatio.value = gl.getPixelRatio();

    if (!hasHover || !dummyMesh || !raycaster || !trailArray) return;

    dummyMesh.rotation.set(0, t * 0.025, 0);
    dummyMesh.updateMatrixWorld();

    const pointerMoved = pointer.x !== lastPointer.current.x || pointer.y !== lastPointer.current.y;
    lastPointer.current.x = pointer.x;
    lastPointer.current.y = pointer.y;

    if (!pointerMoved) return;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(dummyMesh);

    if (hits.length > 0) {
      if (t - lastTrailTime.current > 0.03) {
        const idx = trailIndex.current % TRAIL_LENGTH;
        trailArray[idx].copy(hits[0].point);
        trailIndex.current++;
        trailCount.current = Math.min(trailCount.current + 1, TRAIL_LENGTH);
        lastTrailTime.current = t;
      }
    }

    const uTrail = uniformsRef.current.uTrail.value;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const arrIdx = ((trailIndex.current - 1 - i) % TRAIL_LENGTH + TRAIL_LENGTH) % TRAIL_LENGTH;
      if (i < trailCount.current) {
        uTrail[i].copy(trailArray[arrIdx]);
      } else {
        uTrail[i].copy(FAR_AWAY);
      }
    }
    uniformsRef.current.uTrailCount.value = trailCount.current;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
