"use client";

/**
 * Full-viewport grain + vignette pass.
 *
 * Lives above the WebGL canvas but below the content, so the 3D lantern and
 * the DOM share one filmic texture instead of looking like two layers
 * stacked on top of each other. z-index sits under the custom cursor.
 */
export default function Texture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[50] overflow-hidden"
    >
      {/* Warm light spill pooling in the centre of the viewport */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 38%, rgba(255,140,60,0.07), transparent 70%)",
        }}
      />
    </div>
  );
}
