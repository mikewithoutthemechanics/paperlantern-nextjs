/**
 * A tiny, allocation-free scroll store.
 *
 * The DOM and the WebGL layer both need scroll state, but we never want
 * scroll to trigger React re-renders at 60fps. So: Lenis writes here, and
 * the canvas reads `scrollState` directly inside `useFrame`. Only low
 * frequency, meaningful thresholds are pushed to subscribers.
 */

export const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** raw scrollY in px */
  y: 0,
  /** px per second, signed */
  velocity: 0,
  /** -1 up, 1 down */
  direction: 1,
};

type Listener = (state: typeof scrollState) => void;

const listeners = new Set<Listener>();

export function subscribeScroll(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setScroll(y: number, progress: number, velocity: number) {
  scrollState.y = y;
  scrollState.progress = progress;
  scrollState.velocity = velocity;
  if (Math.abs(velocity) > 0.01) {
    scrollState.direction = velocity > 0 ? 1 : -1;
  }
  for (const fn of listeners) fn(scrollState);
}

/** Framerate-independent damping. `lambda` = how snappy, higher = faster. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Map v from [inMin,inMax] to [outMin,outMax], clamped. */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = clamp((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}

/** Smoothstep easing on a normalised 0→1 value. */
export function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}
