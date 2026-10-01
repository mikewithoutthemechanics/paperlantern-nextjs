import { LanternMark } from "./Nav";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-paper-100/10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* mark */}
          <div className="flex items-center gap-3 text-paper-300">
            <LanternMark className="h-6 w-5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Paperlantern.xyz
            </span>
          </div>

          {/* colophon */}
          <p className="max-w-md text-[12px] leading-relaxed text-paper-400">
            Designed and built in-house. Paper shader and lantern are rendered
            live in WebGL — no video, no images, nothing to load but light.
          </p>

          <a
            href="#top"
            data-cursor="top"
            className="group inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-paper-300 transition-colors duration-300 hover:text-ember-300 sm:self-auto"
          >
            Back to top
            <span
              className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
              aria-hidden
            >
              ↑
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper-100/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-400">
            © {year} Paperlantern — All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-400">
            Made with light
          </p>
        </div>
      </div>
    </footer>
  );
}
