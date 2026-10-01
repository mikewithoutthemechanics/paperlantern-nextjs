"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  lanternVertex,
  lanternFragment,
  flameVertex,
  flameFragment,
} from "@/lib/lanternShader";
import { scrollState, damp, mapRange, smoothstep } from "@/lib/scroll";
import { pointer } from "@/lib/pointer";

/**
 * The lantern itself: a paper shell lit from a flame inside.
 *
 * Everything about it is driven from the scroll store inside useFrame —
 * the paper unfurls, stretches and drifts as you travel down the page.
 * No React state, so this stays at 60fps regardless of scroll speed.
 */
export default function Lantern() {
  const group = useRef<THREE.Group>(null);
  const paperMat = useRef<THREE.ShaderMaterial>(null);
  const flameMat = useRef<THREE.ShaderMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);

  const paperUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpen: { value: 0.3 },
      uHeight: { value: 1 },
      uHover: { value: 0 },
    }),
    [],
  );

  const flameUniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    [],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    const p = scrollState.progress;

    // --- how far the lantern has "unfurled": opens on the first scroll,
    //     then dims and narrows again as you reach the contact section ---
    const open = mapRange(p, 0.0, 0.2, 0.28, 1.0) * mapRange(p, 0.82, 1.0, 1.0, 0.45);
    // --- it stretches taller as it recedes, like heat rising ---
    const stretch = 1 + mapRange(p, 0.15, 0.9, 0, 0.55);

    paperUniforms.uTime.value = t;
    paperUniforms.uOpen.value = damp(paperUniforms.uOpen.value, open, 4, d);
    paperUniforms.uHeight.value = damp(paperUniforms.uHeight.value, stretch, 4, d);
    flameUniforms.uTime.value = t;

    // pointer proximity brightens the flame a touch
    const prox = 1 - Math.min(1, Math.hypot(pointer.x, pointer.y) / 1.4);
    paperUniforms.uHover.value = damp(
      paperUniforms.uHover.value,
      Math.max(0, prox),
      3,
      d,
    );

    // --- the flame throws real light onto nothing, but it does light the
    //     paper from within via the shader, and it flickers the point light
    //     so anything else in the scene shares the same rhythm ---
    if (glow.current) {
      const fl =
        0.8 +
        0.1 * Math.sin(t * 7.3) +
        0.06 * Math.sin(t * 13.7 + 1.3);
      glow.current.intensity = damp(glow.current.intensity, 2.6 * fl, 20, d);
    }

    if (group.current) {
      const g = group.current;
      // recede and drift off-centre so DOM sections have room to breathe
      g.position.x = damp(g.position.x, mapRange(p, 0.08, 0.55, 0, 2.9), 2.2, d);
      g.position.y = damp(g.position.y, mapRange(p, 0.08, 0.55, 0, -1.15), 2.2, d);
      // starts large enough to be the hero object, not so large it swallows
      // the headline — roughly 45% of viewport height
      const s = mapRange(p, 0.05, 0.6, 0.8, 0.42);
      g.scale.setScalar(damp(g.scale.x, s, 2.2, d));

      // idle spin + pointer parallax
      g.rotation.y += d * 0.16;
      g.rotation.x = damp(g.rotation.x, -pointer.y * 0.16, 3, d);
      g.rotation.z = damp(
        g.rotation.z,
        Math.sin(t * 0.5) * 0.035 + pointer.x * 0.05,
        3,
        d,
      );
    }
  });

  return (
    <group ref={group}>
      {/* the paper shell */}
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          ref={paperMat}
          uniforms={paperUniforms}
          vertexShader={lanternVertex}
          fragmentShader={lanternFragment}
          transparent
          side={THREE.DoubleSide}
          depthWrite
        />
      </mesh>

      {/* the flame, seen through the open base */}
      <mesh position={[0, -0.42, 0]} renderOrder={0}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <shaderMaterial
          ref={flameMat}
          uniforms={flameUniforms}
          vertexShader={flameVertex}
          fragmentShader={flameFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* the light itself — lights nothing but drives atmosphere + bloom */}
      <pointLight
        ref={glow}
        position={[0, -0.3, 0]}
        color="#ff8a3d"
        intensity={2.6}
        distance={7}
        decay={2}
      />

      {/* a soft additive halo so the lantern bleeds light into the air
          even before bloom gets to it */}
      <mesh position={[0, -0.1, -0.4]} renderOrder={-1}>
        <planeGeometry args={[5.2, 5.2]} />
        <meshBasicMaterial
          color="#ff8a3d"
          transparent
          opacity={0.12 * smoothstep(scrollState.progress * 4)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
