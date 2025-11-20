/**
 * RequestAnimationFrame utilities for smooth animations
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Throttle using requestAnimationFrame
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null
  let lastArgs: Parameters<T> | null = null

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, lastArgs!)
        rafId = null
        lastArgs = null
      })
    }
  }
}

/**
 * Schedule function on next animation frame
 */
export function nextFrame(callback: () => void): number {
  return requestAnimationFrame(callback)
}

/**
 * Cancel scheduled animation frame
 */
export function cancelFrame(id: number): void {
  cancelAnimationFrame(id)
}

/**
 * Wait for specified number of frames
 */
export async function waitFrames(frames: number = 1): Promise<void> {
  for (let i = 0; i < frames; i++) {
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => resolve())
    })
  }
}
