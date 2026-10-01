"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Lantern from "./Lantern";
import Embers from "./Embers";
import Rig from "./Rig";

/**
 * The scene graph.
 *
 * Depth is built almost entirely in-shader: the paper simulates subsurface
 * scattering itself, so there are no real lights doing the heavy lifting.
 * Bloom is what sells it — without it the lantern is just a shape, with it
 * the light visibly leaks.
 */
export default function SceneInner() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 0, 4.6], fov: 42, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#05050a"), 1);
        // Slightly cooler tone mapping keeps the highlights from going pink.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      {/* matches --color-ink-950 exactly so canvas and page are seamless */}
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 7, 24]} />

      <Rig />
      <Lantern />
      <Embers />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.35}
          luminanceThreshold={0.16}
          luminanceSmoothing={0.55}
          mipmapBlur
          radius={0.78}
        />
        <Vignette offset={0.3} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
