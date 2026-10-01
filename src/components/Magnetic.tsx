"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** how far the element is allowed to travel, in px */
  strength?: number;
};

/**
 * Magnetic hover.
 *
 * The element leans toward the cursor while it's nearby, and springs back
 * with a little overshoot on exit. Implemented with a damped follow in RAF
 * so it trails the pointer instead of snapping to it — the lag is what
 * makes it feel like a physical object rather than a CSS transform.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 22,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // only react when the pointer is genuinely near
      const radius = Math.max(r.width, r.height) * 0.9 + 60;
      if (Math.hypot(dx, dy) > radius) {
        active = false;
        tx = 0;
        ty = 0;
        return;
      }
      active = true;
      tx = (dx / radius) * strength;
      ty = (dy / radius) * strength;
    };

    const tick = () => {
      // snappier when engaging, softer when releasing
      const k = active ? 0.18 : 0.1;
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
