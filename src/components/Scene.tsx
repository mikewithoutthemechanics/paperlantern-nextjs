"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { trackPointer } from "@/lib/pointer";

/**
 * The WebGL layer mounts client-side only: three.js has no meaningful
 * server render, and shipping the canvas through SSR would only delay
 * first paint. `ssr: false` keeps the initial HTML pure and fast.
 */
const SceneInner = dynamic(() => import("./SceneInner"), {
  ssr: false,
  loading: () => null,
});

/** True only when the device can actually run the scene. */
function webglAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function Scene() {
  useEffect(() => trackPointer(), []);

  if (typeof window !== "undefined" && !webglAvailable()) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <SceneInner />
    </div>
  );
}
