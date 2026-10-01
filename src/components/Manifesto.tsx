import Reveal from "./Reveal";
import { disciplines, recognition } from "@/lib/data";

/**
 * MANIFESTO
 *
 * The argument, stated once and without hedging. Set as a word-by-word
 * reveal so the eye is walked down the sentence rather than shown it.
 */
export default function Manifesto() {
  return (
    <section
      id="studio"
      className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-40"
    >
      <Reveal className="mb-14 flex items-center gap-4">
        <span className="h-px w-10 bg-ember-500/60" />
        <span className="label">The studio</span>
      </Reveal>

      <Reveal
        as="p"
        variant="words"
        delay={120}
        className="d-lg font-display max-w-[30ch] text-paper-50"
      >
        Most work is built to be seen. Ours is built to be felt in a dark room
        from across it.
      </Reveal>

      <div className="mt-20 grid gap-12 border-t border-paper-100/10 pt-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal className="flex flex-wrap gap-x-6 gap-y-3">
            {disciplines.map((d, i) => (
              <span
                key={d}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper-300 transition-colors duration-500 hover:text-ember-300"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {d}
              </span>
            ))}
          </Reveal>
        </div>

        <div className="space-y-6 lg:col-span-6 lg:col-start-7">
          <Reveal delay={80}>
            <p className="text-[17px] leading-relaxed text-paper-200">
              Paperlantern is four people, one studio dog, and a shared belief
              that restraint is a form of generosity. We take on six projects a
              year so that each one gets the attention it would need to be
              genuinely good rather than merely delivered.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-[17px] leading-relaxed text-paper-300">
              We work end to end — strategy, identity, interface, motion, and
              the code that runs it. Nothing gets thrown over a wall, because
              the interesting problems live in the seams.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ---------- recognition ticker ---------- */}
      <div className="mt-24 border-y border-paper-100/10 py-6">
        <div className="flex items-center gap-8">
          <span className="label shrink-0">Recognition</span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee gap-10">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-10" aria-hidden={copy === 1}>
                  {recognition.map((r) => (
                    <span
                      key={r}
                      className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-paper-400"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
