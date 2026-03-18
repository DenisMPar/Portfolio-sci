'use client';

import { forwardRef, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform, Vector2, type WebGLRenderer } from 'three';

const _sizeVec = new Vector2();

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uGrain;
  uniform float uBleeding;
  uniform float uScanlines;
  uniform float uVignette;
  uniform float uJitter;
  uniform float uIntensity;

  float rand(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float gaussian(float z, float u, float o) {
    return (1.0 / (o * sqrt(6.2831853))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float time = uTime * 1.8;
    vec2 jitteredUV = uv;

    // Jitter (branchless)
    float jx = (rand(vec2(floor(time * 60.0))) - 0.5) * 0.003 * uJitter * uIntensity;
    float jy = (rand(vec2(floor(time * 30.0) + 1.0)) - 0.5) * 0.001 * uJitter * uIntensity;
    jitteredUV.x += jx * step(0.01, uJitter);
    jitteredUV.y += jy * step(0.01, uJitter);

    vec4 color = texture2D(inputBuffer, jitteredUV);

    // Color bleeding (chromatic aberration) (branchless)
    float bFactor = step(0.01, uBleeding);
    float bleedAmount = 0.012 * uBleeding * uIntensity * bFactor;
    float phase = time * 1.5 + uv.y * 20.0;
    vec2 greenOff1 = vec2(sin(phase) * bleedAmount, 0.0);
    vec2 greenOff2 = vec2(-sin(phase * 1.1) * bleedAmount * 0.8, 0.0);
    
    float r = texture2D(inputBuffer, jitteredUV + greenOff1).r * 0.7;
    float g = color.g;
    vec4 off2Sample = texture2D(inputBuffer, jitteredUV + greenOff2);
    float g2 = off2Sample.g * 0.3;
    float b = off2Sample.b * 0.6;
    
    vec3 bledColor = vec3(r, g + g2, b);
    color.rgb = mix(color.rgb, bledColor, bFactor);

    // Film grain (green-tinted) (branchless)
    float seed = dot(uv, vec2(12.9898, 78.233));
    float noise = fract(sin(seed) * 43758.5453 + time * 2.0);
    noise = gaussian(noise, 0.0, 0.25);
    vec3 grainEffect = vec3(noise * 0.4, noise, noise * 0.5) * 0.075 * uGrain * uIntensity * step(0.01, uGrain);
    grainEffect *= (1.0 - color.rgb);
    color.rgb += grainEffect;

    // Scanlines (branchless)
    float sFactor = step(0.01, uScanlines);
    float freq = 600.0 + uScanlines * 400.0;
    float pattern = sin(uv.y * freq) * 0.5 + 0.5;
    float intensity = 0.1 * uScanlines * uIntensity * sFactor;
    color.rgb *= (1.0 - pattern * intensity);
    float hLines = sin(uv.y * freq * 0.1) * 0.02 * uScanlines * uIntensity * sFactor;
    color.rgb *= (1.0 - hLines);

    // Vignette (branchless)
    float vFactor = step(0.01, uVignette);
    vec2 vig = (uv - 0.5) * 2.0;
    float v = 1.0 - dot(vig, vig) * 0.3 * uVignette * uIntensity * vFactor;
    color.rgb *= mix(1.0, v, vFactor);

    // Cool blue color grade
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(color.rgb, vec3(luma * 0.4, luma * 0.5, luma * 1.0), 0.25);

    outputColor = color;
  }
`;

class AnalogDecayEffect extends Effect {
  constructor({
    grain = 0.4,
    bleeding = 1.0,
    scanlines = 1.0,
    vignette = 1.0,
    jitter = 0.4,
    intensity = 0.6,
  } = {}) {
    super('AnalogDecayEffect', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uTime', new Uniform(0)],
        ['uResolution', new Uniform(new Vector2(1, 1))],
        ['uGrain', new Uniform(grain)],
        ['uBleeding', new Uniform(bleeding)],
        ['uScanlines', new Uniform(scanlines)],
        ['uVignette', new Uniform(vignette)],
        ['uJitter', new Uniform(jitter)],
        ['uIntensity', new Uniform(intensity)],
      ]),
    });
  }

  update(renderer: WebGLRenderer, _inputBuffer: unknown, deltaTime: number) {
    this.uniforms.get('uTime')!.value += deltaTime;
    const res = this.uniforms.get('uResolution')!.value as Vector2;
    res.copy(renderer.getSize(_sizeVec));
  }
}

export const AnalogDecay = forwardRef<AnalogDecayEffect, {
  grain?: number;
  bleeding?: number;
  scanlines?: number;
  vignette?: number;
  jitter?: number;
  intensity?: number;
}>(function AnalogDecay(props, ref) {
  const effect = useMemo(() => new AnalogDecayEffect(props), [props]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
