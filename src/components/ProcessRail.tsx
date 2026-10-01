"use client";

import { useEffect, useRef } from "react";

/**
 * The process rail.
 *
 * A vertical line down the left of the process list with a travelling
 * ember that moves as the section passes through the viewport — so the
 * four steps read as a continuous progression rather than a static list.
 */
export default function ProcessRail() {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let current = 0;

    const tick = () => {
      const el = wrap.current;
      if (el) {
        const r = el.getBoundingClientRect();
        // 0 when the top of the section reaches 75% of the viewport,
        // 1 when its bottom reaches 25% — i.e. it crosses the middle band.
        const span = r.height + window.innerHeight * 0.5;
        const travelled = window.innerHeight * 0.75 - r.top;
        const target = Math.min(1, Math.max(0, travelled / span));
        current += (target - current) * 0.12;

        if (fill.current) fill.current.style.transform = `scaleY(${current})`;
        if (head.current) {
          head.current.style.top = `${current * 100}%`;
          head.current.style.opacity = current > 0.01 && current < 0.99 ? "1" : "0";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="relative hidden w-16 shrink-0 lg:block" aria-hidden>
      {/* track */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-paper-100/12" />
      {/* travelled portion */}
      <div
        ref={fill}
        className="absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2"
        style={{
          transform: "scaleY(0)",
          background: "linear-gradient(180deg, var(--flame), var(--ember) 60%, var(--ember-600))",
        }}
      />
      {/* the travelling ember */}
      <div
        ref={head}
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-200 opacity-0 transition-opacity duration-300"
        style={{ boxShadow: "0 0 14px 4px rgba(255,150,60,0.6)" }}
      />
    </div>
  );
}
