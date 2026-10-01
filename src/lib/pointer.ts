/**
 * Normalised pointer position, tracked on window.
 *
 * The WebGL canvas sits behind the whole page with `pointer-events: none`,
 * so it never receives pointer events of its own. Reading a window-level
 * store instead means the lantern still parallaxes to the cursor while the
 * DOM above it keeps every click and hover.
 */
export const pointer = { x: 0, y: 0 };

export function trackPointer() {
  const onMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}
