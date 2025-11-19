/**
 * Math utilities
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function roundTo(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

export function percentage(value: number, total: number): number {
  if (total === 0) {
    return 0
  }
  return (value / total) * 100
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0
  }
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}

export function max(numbers: number[]): number {
  return Math.max(...numbers)
}

export function min(numbers: number[]): number {
  return Math.min(...numbers)
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}
