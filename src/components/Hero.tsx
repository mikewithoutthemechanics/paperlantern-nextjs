import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

/**
 * HERO
 *
 * The headline is deliberately broken across three mis-aligned lines with
 * the middle of the viewport left empty — that gap is where the 3D lantern
 * lives, so the type and the object interlock instead of overlapping.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-24 sm:px-8 sm:pt-28 lg:pb-12"
    >
      {/* ---------- top meta rail ---------- */}
      <div className="flex items-start justify-between gap-6">
        <Reveal delay={100}>
          <p className="label over-glow max-w-[16rem] leading-relaxed text-paper-300/80">
            Creative studio
            <br />
            Est. 2019
          </p>
        </Reveal>
        <Reveal delay={180}>
          <p className="label over-glow hidden text-right leading-relaxed text-paper-300/80 sm:block">
            Tokyo — London
            <br />
            Working everywhere
          </p>
        </Reveal>
      </div>

      {/* ---------- the headline ---------- */}
      <div className="relative my-auto py-16">
        <h1 className="d-xxl hero-type font-display">
          <Reveal as="span" variant="clip" delay={220} className="block">
            <span className="block">Light,</span>
          </Reveal>

          <Reveal
            as="span"
            variant="clip"
            delay={360}
            className="block pl-[8vw] sm:pl-[14vw]"
          >
            {/* this line sits left of centre so the lantern reads through the gap */}
            <span className="block">folded</span>
          </Reveal>

          <Reveal
            as="span"
            variant="clip"
            delay={500}
            className="block text-right sm:pr-[6vw]"
          >
            <span className="glow-text block">by hand.</span>
          </Reveal>
        </h1>
      </div>

      {/* ---------- sub-copy + actions ---------- */}
      <div className="flex flex-col gap-8 border-t border-paper-100/10 pt-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal delay={650} className="max-w-md">
          <p className="over-glow text-balance text-[15px] leading-relaxed text-paper-300">
            We are a small studio building brands, interfaces and objects for
            people who would rather be noticed than fit in. Everything we make
            is lit from the inside.
          </p>
        </Reveal>

        <Reveal delay={780} className="flex flex-wrap items-center gap-3">
          <Magnetic strength={16}>
            <a
              href="#work"
              data-cursor="see work"
              className="btn inline-flex items-center gap-3 border border-paper-100/20 bg-ink-900/60 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-50 backdrop-blur-sm"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-ember-500 shadow-[0_0_10px_2px_rgba(255,138,61,0.7)]" />
              See the work
            </a>
          </Magnetic>
          <Magnetic strength={16}>
            <a
              href="#contact"
              data-cursor="write"
              className="inline-flex items-center gap-3 border border-transparent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-paper-300 transition-colors duration-300 hover:border-paper-100/15 hover:text-paper-50"
            >
              hello@paperlantern.xyz
            </a>
          </Magnetic>
        </Reveal>
      </div>

      {/* ---------- scroll cue ---------- */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="label text-[10px]">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-paper-100/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-ember-400 to-transparent" />
        </span>
      </div>

      <style>{`
        @keyframes scroll-cue {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
