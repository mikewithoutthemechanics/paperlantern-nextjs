"use client";

import { useEffect, useRef } from "react";
import { scrollState, smoothstep } from "@/lib/scroll";

/**
 * A hairline progress bar that doubles as a "fuel gauge": it ignites from
 * the left as you scroll, with a small bright ember riding the leading edge.
 * Driven imperatively from the scroll store — zero re-renders.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const t = smoothstep(scrollState.progress);
      if (bar.current) bar.current.style.transform = `scaleX(${t})`;
      if (head.current) {
        head.current.style.left = `${t * 100}%`;
        // Ember flares hardest mid-scroll, settles at the very top and bottom.
        head.current.style.opacity = String(
          0.55 + 0.45 * Math.sin(t * Math.PI),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-px"
    >
      <div
        ref={bar}
        className="h-full origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(90deg, rgba(242,236,224,0.15), var(--ember) 85%, var(--flame))",
        }}
      />
      <div
        ref={head}
        className="absolute top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-200"
        style={{ left: "0%", boxShadow: "0 0 10px 3px rgba(255,150,60,0.75)" }}
      />
    </div>
  );
}
