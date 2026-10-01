"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setScroll } from "@/lib/scroll";

/**
 * Drives the whole site from one smooth-scroll source of truth.
 * Lenis writes into the scroll store; the WebGL scene and any
 * subscribeScroll() listener read from it without re-rendering React.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        setScroll(window.scrollY, max > 0 ? window.scrollY / max : 0, 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out — heavy, luxurious, "lantern drifting" feel.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      lerp: 0.1,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      const max = document.body.scrollHeight - window.innerHeight;
      setScroll(
        lenis.scroll,
        max > 0 ? lenis.scroll / max : 0,
        lenis.velocity,
      );
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Let in-page anchors route through Lenis so easing stays consistent.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -10 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
