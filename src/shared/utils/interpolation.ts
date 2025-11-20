/**
 * Interpolation utilities for smooth animations
 */

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function smoothstep(start: number, end: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - start) / (end - start)))
  return x * x * (3 - 2 * x)
}

export function easeInQuad(t: number): number {
  return t * t
}

export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
