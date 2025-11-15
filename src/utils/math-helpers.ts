/**
 * Math helper utilities
 */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function inverseLerp(start: number, end: number, value: number): number {
  return (value - start) / (end - start)
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

export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export function distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min)
}

export function percentage(value: number, total: number): number {
  return (value / total) * 100
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0
  }
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0
  }
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}

export function isEven(num: number): boolean {
  return num % 2 === 0
}

export function isOdd(num: number): boolean {
  return num % 2 !== 0
}
