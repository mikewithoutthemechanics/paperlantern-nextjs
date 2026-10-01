"use client";

import { useEffect, useState, useRef } from "react";
import { ready } from "@/lib/ready";

/**
 * The lantern being lit.
 *
 * Rather than a fake progress bar, the preloader *is* the brand object: a
 * CSS lantern fills with light, and the hero waits for it. It unmounts
 * itself and hands control back to Lenis.
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(100);
      setTimeout(() => {
        setDone(true);
        setTimeout(() => setGone(true), 60);
      }, 120);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const DURATION = 1700;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease-out so the light "arrives" rather than stopping dead.
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        window.setTimeout(() => setGone(true), 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) {
      document.documentElement.classList.add("is-ready");
      // Release every queued reveal now the lantern is lit.
      ready.mark();
    } else {
      document.documentElement.classList.remove("is-ready");
    }
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden={!done}
      aria-live="polite"
      className="fixed inset-0 z-[130] grid place-items-center bg-ink-950 transition-[opacity,transform] duration-[1100ms] [transition-timing-function:cubic-bezier(0.83,0,0.17,1)]"
      style={{
        opacity: done ? 0 : 1,
        transform: done ? "scale(1.04)" : "scale(1)",
        pointerEvents: done ? "none" : "auto",
      }}
    >
      {/* The lantern silhouette, filling with light */}
      <div className="relative grid place-items-center gap-8">
        <div className="relative h-40 w-28">
          {/* paper body */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[46%_46%_44%_44%/34%_34%_40%_40%] border"
            style={{
              borderColor: "rgba(242,236,224,0.22)",
              background: "rgba(242,236,224,0.03)",
            }}
          >
            <div
              className="absolute inset-x-0 bottom-0 transition-[height] duration-200 ease-linear"
              style={{
                height: `${pct}%`,
                background:
                  "linear-gradient(0deg, #ffd9a0 0%, #ff8a3d 55%, #f2651a 100%)",
                boxShadow: "0 0 60px 12px rgba(255,140,60,0.45)",
              }}
            />
            {/* vertical splints */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(5,5,10,0.22) 0 1px, transparent 1px 12px)",
              }}
            />
          </div>
          {/* hoops */}
          <div className="absolute inset-x-[18%] top-[8%] h-px bg-paper-100/30" />
          <div className="absolute inset-x-[16%] bottom-[10%] h-px bg-paper-100/30" />
        </div>

        <div className="flex w-56 flex-col gap-3">
          <div className="label flex items-center justify-between text-paper-200/60">
            <span>Lighting the lantern</span>
            <span className="tabular-nums text-ember-300">
              {String(pct).padStart(3, "0")}
            </span>
          </div>
          <div className="h-px w-full bg-paper-100/15">
            <div
              className="h-full bg-ember-400 transition-[width] duration-200 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
