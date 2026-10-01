"use client";

import { useEffect, useRef } from "react";

/**
 * The custom cursor: a small paper-lamp glow that lags behind the pointer
 * with spring physics, brightens and swells over interactive elements, and
 * turns into a labelled disc on primary actions.
 *
 * Deliberately built from DOM rather than WebGL so it stays crisp above
 * the canvas and costs nothing per frame beyond two transforms.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // target = where the pointer is, current = where the lamp is drawn
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let scale = 1;
    let scaleTarget = 1;
    let opacity = 0;
    let opacityTarget = 0;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        current.x = target.x;
        current.y = target.y;
        opacityTarget = 1;
      }
    };

    const onLeave = () => {
      opacityTarget = 0;
      visible = false;
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "a, button, [data-cursor], input, textarea",
      ) as HTMLElement | null;

      if (!el) {
        scaleTarget = 1;
        if (label.current) label.current.textContent = "";
        return;
      }
      const text = el.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      // Big labelled targets get a disc; plain links just swell a little.
      scaleTarget = text ? 4.2 : 1.85;
    };

    const tick = () => {
      // Critically-ish damped follow, frame-rate independent.
      const k = 1 - Math.exp(-16 * (1 / 60));
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      scale += (scaleTarget - scale) * (1 - Math.exp(-14 * (1 / 60)));
      opacity += (opacityTarget - opacity) * (1 - Math.exp(-10 * (1 / 60)));

      if (dot.current) {
        dot.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      if (halo.current) {
        halo.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (fine.current) {
        // The fine dot stays tight to the true pointer — no lag.
        fine.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%) scale(${1 / Math.max(scale, 1)})`;
      }
      for (const ref of [dot.current, halo.current, fine.current]) {
        if (ref) ref.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      {/* Soft warm halo — the lantern light spilling onto the page */}
      <div
        ref={halo}
        className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(255,190,110,0.30) 0%, rgba(255,138,61,0.10) 45%, transparent 70%)",
          boxShadow: "0 0 40px 6px rgba(255,150,60,0.16)",
        }}
      >
        <span
          ref={label}
          className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-950"
        />
      </div>
      {/* Tight bright core */}
      <div
        ref={dot}
        className="absolute left-0 top-0 h-[7px] w-[7px] rounded-full bg-ember-300 will-change-transform"
        style={{ boxShadow: "0 0 12px 2px rgba(255,190,110,0.7)" }}
      />
      {/* True-pointer pinpoint, counter-scaled so it never blurs */}
      <div
        ref={fine}
        className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-paper-50 will-change-transform"
      />
    </div>
  );
}
