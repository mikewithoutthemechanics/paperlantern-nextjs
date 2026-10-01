import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/data";

export default function Work() {
  return (
    <section
      id="work"
      className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36"
    >
      {/* ---------- section header ---------- */}
      <div className="mb-16 flex flex-col gap-8 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-ember-500/60" />
            <span className="label">Selected work</span>
          </Reveal>
          <Reveal as="h2" variant="clip" delay={80} className="d-xl font-display text-paper-50">
            Six things we
            <br />
            lit up.
          </Reveal>
        </div>

        <Reveal delay={200} className="max-w-xs">
          <p className="text-[14px] leading-relaxed text-paper-400">
            A small fraction of what we have made. Ask us about the other
            ninety-four percent — it is usually the interesting part.
          </p>
        </Reveal>
      </div>

      {/* ---------- grid ----------
          Offsetting every other column on wide screens gives the list an
          editorial rhythm instead of a uniform spreadsheet.          */}
      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-24">
        {projects.map((p, i) => (
          <Reveal
            key={p.id}
            delay={(i % 2) * 110}
            className={i % 2 === 1 ? "lg:mt-24" : ""}
          >
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
