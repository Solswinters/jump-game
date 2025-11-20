/**
 * 2D Vector utilities
 */

export interface Vector2D {
  x: number
  y: number
}

export function add(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function multiply(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar }
}

export function divide(v: Vector2D, scalar: number): Vector2D {
  if (scalar === 0) {
    throw new Error('Division by zero')
  }
  return { x: v.x / scalar, y: v.y / scalar }
}

export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v)
  if (mag === 0) {
    return { x: 0, y: 0 }
  }
  return divide(v, mag)
}

export function dot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y
}

export function distance(a: Vector2D, b: Vector2D): number {
  return magnitude(subtract(a, b))
}

export function angle(v: Vector2D): number {
  return Math.atan2(v.y, v.x)
}

export function rotate(v: Vector2D, angleRad: number): Vector2D {
  const cos = Math.cos(angleRad)
  const sin = Math.sin(angleRad)
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  }
}
