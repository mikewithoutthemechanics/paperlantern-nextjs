import Reveal from "./Reveal";
import ProcessRail from "./ProcessRail";
import { process } from "@/lib/data";

export default function Process() {
  return (
    <section
      id="process"
      className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36"
    >
      <Reveal className="mb-14 flex items-center gap-4">
        <span className="h-px w-10 bg-ember-500/60" />
        <span className="label">How it works</span>
      </Reveal>

      <div className="flex gap-8">
        <ProcessRail />

        <div className="min-w-0 flex-1">
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div className="group border-t border-paper-100/10 py-8 transition-colors duration-500 last:border-b sm:py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
                  {/* number */}
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember-400/70 transition-colors duration-500 group-hover:text-ember-300">
                    {step.n}
                  </span>

                  <div className="flex-1">
                    <h3 className="d-lg font-display text-paper-100 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-paper-400 transition-colors duration-500 group-hover:text-paper-200">
                      {step.body}
                    </p>
                  </div>

                  {/* rule that draws itself on hover */}
                  <span className="hidden h-px w-24 self-center bg-paper-100/20 sm:block">
                    <span className="block h-px w-0 bg-ember-400 transition-[width] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
