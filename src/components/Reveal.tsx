"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ready } from "@/lib/ready";

type Tag = "div" | "span" | "p" | "h2" | "h3" | "section" | "li";

type Props = {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** "up" fades and lifts, "clip" wipes open from a mask, "words" splits by word */
  variant?: "up" | "clip" | "words";
  className?: string;
  /** semantic element to render — restricted to the tags the site uses */
  as?: Tag;
  /** fraction of the element that must be visible before revealing */
  threshold?: number;
};

/**
 * Scroll-triggered entrance.
 *
 * Uses one IntersectionObserver per instance (they unobserve themselves the
 * moment they fire, so nothing is left running), and dispatches the tag
 * explicitly rather than through a polymorphic `ElementType` — that union
 * collapses every prop to `never` and forces an `any` cast to escape.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
  as: Tag = "div",
  threshold = 0.18,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    let safety = 0;

    const observe = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) return;

      // No IO support: show the content rather than hide it forever.
      if (typeof IntersectionObserver === "undefined") {
        el.classList.add("is-in");
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io?.unobserve(entry.target);
            }
          }
        },
        { threshold, rootMargin: "0px 0px -8% 0px" },
      );

      io.observe(el);
    };

    // Hold every reveal until the preloader has cleared, otherwise the hero
    // plays out unseen behind it.
    void ready.when().then(observe);
    // Never leave content invisible if something goes wrong up there.
    safety = window.setTimeout(observe, 6000);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      io?.disconnect();
    };
  }, [threshold]);

  const base =
    variant === "clip" ? "reveal-clip-host" : variant === "words" ? "" : "reveal";

  // A callback ref rather than a RefObject: RefObject<HTMLElement> is not
  // assignable to Ref<HTMLSpanElement> & co., but a contravariant callback is.
  const setEl = (el: HTMLElement | null) => {
    ref.current = el;
  };

  const common = {
    ref: setEl,
    style: { "--rd": `${delay}ms` } as CSSProperties,
    className: `${base} ${className}`.trim(),
    "data-variant": variant,
  };

  const content =
    variant === "words" ? (
      <SplitWords delay={delay}>{children}</SplitWords>
    ) : variant === "clip" ? (
      // The clip lives on this inner wrapper, never on the observed element:
      // a clip-path clips the box IntersectionObserver measures, so putting
      // `inset(0 0 100% 0)` on the observed node collapses its intersection
      // ratio to 0 and it can never satisfy the threshold.
      <span className="reveal-clip">{children}</span>
    ) : (
      children
    );

  switch (Tag) {
    case "span":
      return <span {...common}>{content}</span>;
    case "p":
      return <p {...common}>{content}</p>;
    case "h2":
      return <h2 {...common}>{content}</h2>;
    case "h3":
      return <h3 {...common}>{content}</h3>;
    case "section":
      return <section {...common}>{content}</section>;
    case "li":
      return <li {...common}>{content}</li>;
    default:
      return <div {...common}>{content}</div>;
  }
}

/**
 * Wraps each word in an overflow-hidden span with an inner span that slides
 * up from behind it, so the sentence appears to be pulled out of a slot.
 */
function SplitWords({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const words = text.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <span className="word" key={`${word}-${i}`}>
          <span style={{ "--wd": `${delay + i * 55}ms` } as CSSProperties}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}
