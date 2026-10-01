"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { scrollState, damp, mapRange } from "@/lib/scroll";
import { pointer } from "@/lib/pointer";

/**
 * Camera rig.
 *
 * A single source of truth: Lenis writes scroll progress into the store,
 * and here we translate that into a slow dolly-back plus pointer parallax.
 * Also handles reduced-motion by freezing the dolly entirely.
 */
export default function Rig() {
  const { camera } = useThree();
  const reduced = useRef(false);

  if (reduced.current === false && typeof window !== "undefined") {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const p = reduced.current ? 0 : scrollState.progress;

    // dolly back as we travel down the page
    const z = mapRange(p, 0, 1, 5.3, 8.6);
    const y = mapRange(p, 0, 1, 0, -0.45);

    camera.position.z = damp(camera.position.z, z, 2.4, d);
    camera.position.y = damp(camera.position.y, y + pointer.y * 0.14, 3, d);
    camera.position.x = damp(camera.position.x, pointer.x * 0.28, 3, d);

    camera.lookAt(0, mapRange(p, 0, 1, 0, -0.3), 0);
  });

  return null;
}
