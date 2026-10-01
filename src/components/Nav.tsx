"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scroll";
import Magnetic from "./Magnetic";

const links = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

/** The mark: a lantern reduced to its smallest legible form. */
function LanternMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      {/* hanger */}
      <path d="M12 1.5v3" />
      {/* body */}
      <rect x="4.2" y="4.5" width="15.6" height="23" rx="7" />
      {/* bamboo hoops */}
      <path d="M5.4 11.5h13.2M5.4 20.5h13.2" opacity="0.55" />
      {/* the flame, drawn filled rather than stroked */}
      <path
        d="M12 25.5c1.9 0 3.2-1.3 3.2-3.1 0-2-1.7-2.9-2.3-5-1.4.9-1.1 2.3-2.2 2.7-.6.2-1 .8-1 1.6 0 1.6 1.4 3.8 2.3 3.8Z"
        fill="var(--ember-500)"
        stroke="none"
      />
    </svg>
  );
}

export default function Nav() {
  const [state, setState] = useState<"hidden" | "shown" | "up">("hidden");
  const last = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const y = scrollState.y;
      // Slide away on downward scroll past the hero, return on the way up.
      let next: typeof state = "hidden";
      if (y > window.innerHeight * 0.9) {
        next = y > last.current + 4 ? "up" : "shown";
      }
      if (next !== state) setState(next);
      last.current = y;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `state` intentionally omitted: the RAF loop owns the decision, the
    // effect just needs to exist once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform:
          state === "up" ? "translateY(-120%)" : "translateY(0)",
        opacity: state === "hidden" ? 0 : 1,
        pointerEvents: state === "hidden" ? "none" : "auto",
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-4 sm:px-8 sm:py-5">
        {/* --- mark --- */}
        <a
          href="#top"
          data-cursor="top"
          className="group flex items-center gap-3 text-paper-100"
        >
          <LanternMark className="h-7 w-6 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5" />
          <span className="font-mono text-[11px] uppercase leading-tight tracking-[0.2em]">
            Paperlantern
            <span className="block text-paper-400/70">.xyz</span>
          </span>
        </a>

        {/* --- links --- */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Magnetic key={l.href} strength={8}>
              <a
                href={l.href}
                className="group relative block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper-300 transition-colors duration-300 hover:text-paper-50"
              >
                {l.label}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-ember-500 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            </Magnetic>
          ))}
        </nav>

        {/* --- availability + cta --- */}
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-paper-100/12 px-3 py-1.5 lg:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-300">
              Booking Q3
            </span>
          </span>
          <Magnetic strength={10}>
            <a
              href="#contact"
              data-cursor="let's talk"
              className="btn inline-flex items-center gap-2 border border-paper-100/20 bg-ink-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-100 backdrop-blur-sm sm:px-5"
            >
              Start a project
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}

export { LanternMark };
