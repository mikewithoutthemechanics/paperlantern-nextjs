"use client";

import { useEffect, useRef } from "react";
import { scrollState, damp } from "@/lib/scroll";

/**
 * Legibility scrim.
 *
 * The lantern stays lit behind the entire page, which is the point — but
 * body copy needs a floor. This is a fixed gradient that is invisible during
 * the hero (where the lantern should be at full strength) and fades in
 * behind the content sections, weighted to the left so the lantern's glow
 * still bleeds through on the right.
 *
 * Driven imperatively; costs nothing.
 */
export default function Scrim() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let current = 0;
    const tick = () => {
      const d = 1 / 60;
      // fully clear through the hero, in by the time the manifesto arrives
      const target = Math.min(1, Math.max(0, (scrollState.progress - 0.015) / 0.09));
      current = damp(current, target, 6, d);
      if (ref.current) ref.current.style.opacity = current.toFixed(3);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
      <div
        ref={ref}
        className="h-full w-full"
        style={{
          opacity: 0,
          background:
            "linear-gradient(100deg, rgba(5,5,10,0.95) 0%, rgba(5,5,10,0.9) 38%, rgba(5,5,10,0.6) 66%, rgba(5,5,10,0.12) 88%, transparent 100%)",
        }}
      />
      {/* soften the seam where the fixed canvas meets long scrolling sections */}
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,10,0.9) 0%, transparent 12%, transparent 88%, rgba(5,5,10,0.9) 100%)",
        }}
      />
    </div>
  );
}
