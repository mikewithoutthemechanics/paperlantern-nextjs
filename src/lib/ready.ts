/**
 * Marks the moment the preloader has finished lighting up.
 *
 * Scroll-triggered reveals must not start until then, otherwise the hero
 * animates invisibly behind the preloader and is fully revealed by the time
 * the light clears it — you would just arrive late to something already done.
 */
export const ready = {
  isReady: false,
  waiters: [] as Array<() => void>,

  mark() {
    if (this.isReady) return;
    this.isReady = true;
    const pending = this.waiters;
    this.waiters = [];
    for (const fn of pending) fn();
  },

  /** Resolves once the site is unveiled — or immediately if it already is. */
  when(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isReady) resolve();
      else this.waiters.push(resolve);
    });
  },
};
