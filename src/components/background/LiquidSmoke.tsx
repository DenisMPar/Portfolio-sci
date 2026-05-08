import { useMemo } from 'react';
import { useFrame, useLoader, useThree, createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import {
  Vector2,
  Scene,
  OrthographicCamera,
  TextureLoader,
  RepeatWrapping,
  LinearFilter,
  ShaderMaterial,
  AdditiveBlending,
  NoBlending,
} from 'three';

const elapsedRef = { value: 0 };
const _sizeVec = new Vector2();

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uNoiseTex;

  varying vec2 vUv;

  void main() {
    float t = uTime * 0.1225;
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Layer 1: slow large-scale drift (covers full screen)
    vec2 uv1 = p * 0.3 + vec2(t * 0.04, t * 0.02);
    float n1 = texture2D(uNoiseTex, uv1).r;

    // Layer 2: medium detail, different direction
    vec2 uv2 = p * 0.6 + vec2(-t * 0.03, t * 0.05);
    float n2 = texture2D(uNoiseTex, uv2).r;

    // Layer 3: fine detail, subtle warp
    vec2 warp = vec2(n1 - 0.5, n2 - 0.5) * 0.15;
    vec2 uv3 = p * 1.0 + warp + vec2(t * 0.02, -t * 0.03);
    float n3 = texture2D(uNoiseTex, uv3).r;

    // Blend layers (similar to fbm weighting)
    float f = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Barely visible dark blue
    vec3 col1 = vec3(0.005, 0.006, 0.02);
    vec3 col2 = vec3(0.015, 0.018, 0.05);
    vec3 color = mix(col1, col2, f);

    // Vignette to darken edges
    float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.5;
    color *= clamp(vig, 0.0, 1.0);

    float alpha = smoothstep(0.0, 0.05, length(color)) * 0.35;
    gl_FragColor = vec4(color, alpha);
  }
`;

const displayFragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uTex, vUv);
  }
`;

const PLANE_SIZE = 120;
const RES_SCALE = 0.5;

export function LiquidSmoke() {
  const { size } = useThree();

  const fboW = Math.max(1, Math.floor(size.width * RES_SCALE));
  const fboH = Math.max(1, Math.floor(size.height * RES_SCALE));

  const fbo = useFBO(fboW, fboH, {
    depthBuffer: false,
    stencilBuffer: false,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    generateMipmaps: false,
  });

  const offscreenScene = useMemo(() => new Scene(), []);
  const offscreenCamera = useMemo(() => {
    const c = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    c.position.z = 0.5;
    return c;
  }, []);

  const noiseTex = useLoader(TextureLoader, '/noise.webp');
  noiseTex.wrapS = RepeatWrapping;
  noiseTex.wrapT = RepeatWrapping;
  noiseTex.magFilter = LinearFilter;
  noiseTex.minFilter = LinearFilter;
  noiseTex.generateMipmaps = false;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uNoiseTex: { value: noiseTex },
    }),
    [noiseTex]
  );

  const smokeMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthWrite: false,
        depthTest: false,
        blending: NoBlending,
      }),
    [uniforms]
  );

  const displayMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader: displayFragmentShader,
        uniforms: { uTex: { value: fbo.texture } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [fbo.texture]
  );

  useFrame(({ gl }, delta) => {
    elapsedRef.value += delta;
    uniforms.uTime.value = elapsedRef.value;
    uniforms.uResolution.value.copy(gl.getSize(_sizeVec));

    gl.setRenderTarget(fbo);
    gl.render(offscreenScene, offscreenCamera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <mesh material={smokeMaterial}>
          <planeGeometry args={[1, 1]} />
        </mesh>,
        offscreenScene
      )}
      <mesh
        position={[0, 0, -15]}
        material={displayMaterial}
        renderOrder={-10}
      >
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      </mesh>
    </>
  );
}
