"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState, damp } from "@/lib/scroll";

/**
 * Embers and dust.
 *
 * Two GPU particle systems sharing one shader: warm embers that rise out of
 * the lantern's open base, and a cool, slow dust field that gives the empty
 * space some depth. All motion is computed in the vertex shader from a
 * single uTime uniform — zero CPU work per frame.
 */

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uRise;     // how fast particles travel up
uniform float uSpread;   // radius of the spawn cylinder
uniform float uSpan;     // height of the spawn volume

attribute float aSeed;
attribute float aSpeed;
attribute float aSize;

varying float vAlpha;
varying float vHeat;

void main() {
  vec3 p = position;

  // 0 → 1 over the particle's life, then wrap back to the bottom
  float life = fract(uTime * aSpeed * 0.06 + aSeed);
  p.y = mod(p.y + life * uSpan, uSpan) - uSpan * 0.5;

  // lazy horizontal drift so nothing moves in a straight line
  p.x += sin(uTime * 0.45 + aSeed * 31.0) * 0.22;
  p.z += cos(uTime * 0.37 + aSeed * 17.0) * 0.22;

  // embers cool as they climb
  vHeat = 1.0 - life;
  // fade in at the bottom, out at the top
  vAlpha = sin(life * 3.14159265);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * uPixelRatio * (16.0 / max(-mv.z, 0.001));
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform vec3  uHot;
uniform vec3  uCool;
uniform float uOpacity;
uniform float uHeatMix;

varying float vAlpha;
varying float vHeat;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float a = pow(smoothstep(0.5, 0.0, d), 2.4);
  vec3 col = mix(uCool, uHot, mix(1.0, vHeat, uHeatMix));

  gl_FragColor = vec4(col, a * vAlpha * uOpacity);
}
`;

type Props = {
  count: number;
  radius: number;
  height: number;
  rise: number;
  size: number;
  hot: string;
  cool: string;
  opacity: number;
  /** ember behaviour: rise + cool over time. dust: no rise, cool colour. */
  heatMix?: number;
  fadeWithScroll?: boolean;
};

function Particles({
  count,
  radius,
  height,
  rise,
  size,
  hot,
  cool,
  opacity,
  heatMix = 1,
  fadeWithScroll = true,
}: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const speed = new Float32Array(count);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // bias toward the centre so the column reads as coming off the flame
      const r = Math.pow(Math.random(), 0.7) * radius;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * height;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seed[i] = Math.random();
      speed[i] = rise * (0.55 + Math.random() * 0.9);
      sz[i] = size * (0.4 + Math.random() * 1.1);
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), height);
    return g;
  }, [count, radius, height, rise, size]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uRise: { value: rise },
      uSpread: { value: radius },
      uSpan: { value: height },
      uHot: { value: new THREE.Color(hot) },
      uCool: { value: new THREE.Color(cool) },
      uOpacity: { value: opacity },
      uHeatMix: { value: heatMix },
    }),
    [rise, radius, height, hot, cool, opacity, heatMix],
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    const d = Math.min(dt, 0.05);
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uPixelRatio.value = state.viewport.dpr ?? 1;

    // embers burn out as you leave the hero; dust lingers
    const target = fadeWithScroll
      ? opacity * Math.max(0, 1 - scrollState.progress * 2.6)
      : opacity;
    mat.current.uniforms.uOpacity.value = damp(
      mat.current.uniforms.uOpacity.value,
      target,
      3,
      d,
    );
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Embers() {
  return (
    <group>
      {/* embers lifting out of the lantern */}
      <Particles
        count={220}
        radius={0.55}
        height={4.2}
        rise={1}
        size={2.1}
        hot="#ffd9a0"
        cool="#f2651a"
        opacity={0.95}
        heatMix={1}
      />
      {/* cool ambient dust giving the void some depth */}
      <Particles
        count={320}
        radius={6.5}
        height={12}
        rise={0.25}
        size={1.1}
        hot="#c9b9a4"
        cool="#4a4360"
        opacity={0.3}
        heatMix={0}
        fadeWithScroll={false}
      />
    </group>
  );
}
