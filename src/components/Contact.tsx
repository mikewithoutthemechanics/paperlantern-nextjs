import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import { email, socials } from "@/lib/data";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-paper-100/10"
    >
      {/* ---------- oversized ticker ---------- */}
      <div
        className="flex overflow-hidden border-b border-paper-100/10 py-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        aria-hidden
      >
        <div className="marquee marquee--reverse gap-8">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-8">
              {Array.from({ length: 4 }).map((_, n) => (
                <span key={n} className="flex items-center gap-8">
                  <span className="whitespace-nowrap font-display text-[clamp(2rem,6vw,5rem)] leading-none text-paper-50/90">
                    Let&apos;s make something that glows
                  </span>
                  <span className="text-ember-500">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- the ask ---------- */}
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-40">
        <Reveal className="mb-10 flex items-center gap-4">
          <span className="h-px w-10 bg-ember-500/60" />
          <span className="label">Contact</span>
        </Reveal>

        <Reveal as="p" delay={80} className="d-lg font-display max-w-[24ch] text-paper-100">
          Got something in mind?
        </Reveal>

        {/* the email: the single loudest element on the page */}
        <Reveal delay={160} className="mt-6">
          <Magnetic strength={18}>
            <a
              href={`mailto:${email}`}
              data-cursor="write us"
              className="group inline-block"
            >
              <span className="glow-text block font-display text-[clamp(1.75rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.04em]">
                {email}
              </span>
              <span className="mt-4 block h-px w-full origin-left scale-x-100 bg-gradient-to-r from-ember-400 via-ember-500 to-transparent transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0" />
            </a>
          </Magnetic>
        </Reveal>

        {/* ---------- supporting details ---------- */}
        <div className="mt-24 grid gap-12 border-t border-paper-100/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <p className="label mb-4">Availability</p>
            <p className="flex items-center gap-2 text-[15px] text-paper-100">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade-400" />
              </span>
              Two slots, Q3 2026
            </p>
          </Reveal>

          <Reveal delay={80}>
            <p className="label mb-4">Response time</p>
            <p className="text-[15px] text-paper-200">
              Within one working day. Usually faster.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="label mb-4">Elsewhere</p>
            <ul className="space-y-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 text-[15px] text-paper-300 transition-colors duration-300 hover:text-ember-300"
                  >
                    {s.label}
                    <span
                      className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240}>
            <p className="label mb-4">Studios</p>
            <p className="text-[15px] leading-relaxed text-paper-200">
              Tokyo — 2-14-7 Shibuya
              <br />
              London — E2 8AA
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
