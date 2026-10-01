"use client";

import { useRef } from "react";
import type { Project } from "@/lib/data";

/**
 * A single project card.
 *
 * The cover art is generated entirely in CSS from the project's two colours
 * — no image assets, no layout shift, and every project gets a distinct
 * piece of art derived from its own palette. On hover the card tilts toward
 * the pointer in 3D and its border ignites under the cursor.
 */
export default function ProjectCard({
  project,
  tilt = 6,
}: {
  project: Project;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    // feed the border-ignition gradient
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);

    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * tilt}deg) rotateY(${(px - 0.5) * tilt}deg) translateZ(0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
  };

  const { glow, ink, index, title, year, disciplines, blurb, award } = project;

  return (
    <article
      className="group card-glow"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <a
        href={`#${project.id}`}
        data-cursor="view"
        className="block focus-visible:outline-none"
        aria-label={`${title} — ${disciplines.join(", ")}, ${year}`}
      >
        {/* ---------- generated cover ---------- */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-paper-100/10 transition-[border-color,box-shadow] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:border-paper-100/25"
          style={{
            background: [
              `radial-gradient(115% 85% at 28% 12%, ${glow}cc 0%, transparent 58%)`,
              `radial-gradient(85% 70% at 82% 88%, ${glow}4d 0%, transparent 62%)`,
              `linear-gradient(158deg, ${ink} 0%, #05050a 82%)`,
            ].join(","),
            boxShadow: `inset 0 0 80px 10px rgba(5,5,10,0.55)`,
          }}
        >
          {/* the lantern, echoed: a soft disc that swells on hover */}
          <div
            className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.35]"
            style={{
              background: `radial-gradient(circle, ${glow}00 0%, ${glow}88 30%, ${glow}22 55%, transparent 72%)`,
              filter: "blur(6px)",
            }}
          />

          {/* grain within the art so it doesn't look vector-flat */}
          <div
            className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* outlined index, huge, bottom-left */}
          <span
            className="absolute bottom-3 left-4 select-none font-display text-[5.5rem] leading-none text-paper-50/[0.07] transition-colors duration-700 group-hover:text-paper-50/[0.12] sm:text-[7rem]"
            style={{ WebkitTextStroke: "1px currentColor" }}
          >
            {index}
          </span>

          {award && (
            <span className="absolute right-4 top-4 rounded-full border border-paper-50/25 bg-ink-950/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper-100 backdrop-blur-sm">
              {award}
            </span>
          )}

          <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-50/70">
            {year}
          </span>
        </div>

        {/* ---------- caption ---------- */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="d-md font-display text-paper-50 transition-colors duration-500 group-hover:text-ember-200">
              {title}
            </h3>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-400">
              {disciplines.join(" · ")}
            </p>
          </div>
          <span
            className="mt-1 shrink-0 font-mono text-[11px] text-paper-400 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-300"
            aria-hidden
          >
            ↗
          </span>
        </div>

        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-paper-400 transition-colors duration-500 group-hover:text-paper-200">
          {blurb}
        </p>
      </a>
    </article>
  );
}
