/**
 * Game Utilities - Consolidated game-specific utility functions
 * Refactored to reduce duplication and improve maintainability
 */

/**
 * Calculate distance between two points
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Check collision between two circles
 */
export function checkCircleCollision(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const distance = calculateDistance(x1, y1, x2, y2)
  return distance < r1 + r2
}

/**
 * Check collision between two rectangles (AABB)
 */
export function checkRectCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1)
}

/**
 * Calculate angle between two points
 */
export function calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1)
}

/**
 * Normalize angle to 0-2π range
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += Math.PI * 2
  while (angle >= Math.PI * 2) angle -= Math.PI * 2
  return angle
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Generate random number between min and max
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1))
}

/**
 * Pick random element from array
 */
export function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

/**
 * Shuffle array in place (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Calculate score with multiplier
 */
export function calculateScore(baseScore: number, multiplier: number): number {
  return Math.floor(baseScore * multiplier)
}

/**
 * Format score with commas
 */
export function formatScore(score: number): string {
  return score.toLocaleString()
}

/**
 * Format time as MM:SS
 */
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calculate difficulty multiplier
 */
export function getDifficultyMultiplier(
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
): number {
  const multipliers = {
    easy: 0.75,
    normal: 1.0,
    hard: 1.5,
    extreme: 2.0,
  }
  return multipliers[difficulty]
}

/**
 * Check if point is inside rectangle
 */
export function isPointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
}

/**
 * Ease in-out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Ease in-out quad
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Check if value is in range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Round to decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export default {
  calculateDistance,
  checkCircleCollision,
  checkRectCollision,
  clamp,
  lerp,
  calculateAngle,
  normalizeAngle,
  degToRad,
  radToDeg,
  randomRange,
  randomInt,
  randomElement,
  shuffleArray,
  calculateScore,
  formatScore,
  formatGameTime,
  getDifficultyMultiplier,
  isPointInRect,
  easeInOutCubic,
  easeInOutQuad,
  mapRange,
  inRange,
  roundTo,
}
