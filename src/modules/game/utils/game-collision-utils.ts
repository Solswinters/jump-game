/**
 * Advanced collision detection utilities for game development
 * Provides various collision detection algorithms
 */

import { Vector2, Rect } from '../types/game-types'

export interface Circle {
  x: number
  y: number
  radius: number
}

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface Polygon {
  points: Vector2[]
}

export class GameCollisionUtils {
  /**
   * AABB (Axis-Aligned Bounding Box) collision detection
   */
  static rectIntersect(rect1: Rect, rect2: Rect): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  /**
   * Circle collision detection
   */
  static circleIntersect(circle1: Circle, circle2: Circle): boolean {
    const dx = circle2.x - circle1.x
    const dy = circle2.y - circle1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < circle1.radius + circle2.radius
  }

  /**
   * Point in rectangle collision
   */
  static pointInRect(point: Vector2, rect: Rect): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    )
  }

  /**
   * Point in circle collision
   */
  static pointInCircle(point: Vector2, circle: Circle): boolean {
    const dx = point.x - circle.x
    const dy = point.y - circle.y
    return dx * dx + dy * dy <= circle.radius * circle.radius
  }

  /**
   * Circle-Rectangle collision
   */
  static circleRectIntersect(circle: Circle, rect: Rect): boolean {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width))
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height))

    // Calculate distance from circle center to this closest point
    const dx = circle.x - closestX
    const dy = circle.y - closestY

    // Check if the distance is less than the circle's radius
    return dx * dx + dy * dy < circle.radius * circle.radius
  }

  /**
   * Line-Line intersection
   */
  static lineIntersect(line1: Line, line2: Line): boolean {
    const { x1, y1, x2, y2 } = line1
    const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    if (denominator === 0) {
      return false // Lines are parallel
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  }

  /**
   * Line-Circle intersection
   */
  static lineCircleIntersect(line: Line, circle: Circle): boolean {
    const { x1, y1, x2, y2 } = line
    const { x: cx, y: cy, radius } = circle

    // Vector from line start to end
    const dx = x2 - x1
    const dy = y2 - y1

    // Vector from line start to circle center
    const fx = x1 - cx
    const fy = y1 - cy

    // Quadratic coefficients
    const a = dx * dx + dy * dy
    const b = 2 * (fx * dx + fy * dy)
    const c = fx * fx + fy * fy - radius * radius

    const discriminant = b * b - 4 * a * c

    if (discriminant < 0) {
      return false
    }

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a)
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a)

    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)
  }

  /**
   * Line-Rectangle intersection
   */
  static lineRectIntersect(line: Line, rect: Rect): boolean {
    // Check if either endpoint is inside the rectangle
    if (
      this.pointInRect({ x: line.x1, y: line.y1 }, rect) ||
      this.pointInRect({ x: line.x2, y: line.y2 }, rect)
    ) {
      return true
    }

    // Check intersection with all four sides of the rectangle
    const rectLines: Line[] = [
      { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y }, // Top
      { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height }, // Right
      { x1: rect.x, y1: rect.y + rect.height, x2: rect.x + rect.width, y2: rect.y + rect.height }, // Bottom
      { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height }, // Left
    ]

    return rectLines.some((rectLine) => this.lineIntersect(line, rectLine))
  }

  /**
   * Point in Polygon collision (using ray casting algorithm)
   */
  static pointInPolygon(point: Vector2, polygon: Polygon): boolean {
    const { x, y } = point
    const { points } = polygon
    let inside = false

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x
      const yi = points[i].y
      const xj = points[j].x
      const yj = points[j].y

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

      if (intersect) {
        inside = !inside
      }
    }

    return inside
  }

  /**
   * Polygon-Polygon collision (using Separating Axis Theorem)
   */
  static polygonIntersect(poly1: Polygon, poly2: Polygon): boolean {
    const polygons = [poly1, poly2]

    for (const polygon of polygons) {
      const points = polygon.points

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i]
        const p2 = points[(i + 1) % points.length]

        // Get the perpendicular (normal) to the edge
        const normal = {
          x: -(p2.y - p1.y),
          y: p2.x - p1.x,
        }

        // Project both polygons onto the normal
        let min1 = Infinity
        let max1 = -Infinity
        for (const p of poly1.points) {
          const projection = normal.x * p.x + normal.y * p.y
          min1 = Math.min(min1, projection)
          max1 = Math.max(max1, projection)
        }

        let min2 = Infinity
        let max2 = -Infinity
        for (const p of poly2.points) {
          const projection = normal.x * p.x + normal.y * p.y
          min2 = Math.min(min2, projection)
          max2 = Math.max(max2, projection)
        }

        // Check for separation
        if (max1 < min2 || max2 < min1) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Get the closest point on a line segment to a given point
   */
  static closestPointOnLine(point: Vector2, line: Line): Vector2 {
    const { x1, y1, x2, y2 } = line
    const dx = x2 - x1
    const dy = y2 - y1

    if (dx === 0 && dy === 0) {
      return { x: x1, y: y1 }
    }

    const t = Math.max(
      0,
      Math.min(1, ((point.x - x1) * dx + (point.y - y1) * dy) / (dx * dx + dy * dy))
    )

    return {
      x: x1 + t * dx,
      y: y1 + t * dy,
    }
  }

  /**
   * Calculate penetration depth for AABB collision
   */
  static rectPenetration(rect1: Rect, rect2: Rect): Vector2 | null {
    if (!this.rectIntersect(rect1, rect2)) {
      return null
    }

    const overlapX1 = rect1.x + rect1.width - rect2.x
    const overlapX2 = rect2.x + rect2.width - rect1.x
    const overlapY1 = rect1.y + rect1.height - rect2.y
    const overlapY2 = rect2.y + rect2.height - rect1.y

    const minOverlapX = Math.min(overlapX1, overlapX2)
    const minOverlapY = Math.min(overlapY1, overlapY2)

    if (minOverlapX < minOverlapY) {
      return { x: overlapX1 < overlapX2 ? -minOverlapX : minOverlapX, y: 0 }
    } else {
      return { x: 0, y: overlapY1 < overlapY2 ? -minOverlapY : minOverlapY }
    }
  }

  /**
   * Swept AABB collision detection (for moving objects)
   */
  static sweptAABB(
    movingRect: Rect,
    velocity: Vector2,
    staticRect: Rect
  ): {
    collisionTime: number
    normal: Vector2
  } | null {
    // Expand the static rect by the size of the moving rect
    const expandedRect: Rect = {
      x: staticRect.x - movingRect.width / 2,
      y: staticRect.y - movingRect.height / 2,
      width: staticRect.width + movingRect.width,
      height: staticRect.height + movingRect.height,
    }

    // Ray from center of moving rect
    const rayOrigin: Vector2 = {
      x: movingRect.x + movingRect.width / 2,
      y: movingRect.y + movingRect.height / 2,
    }

    // Calculate time of collision for each axis
    const tNear = { x: -Infinity, y: -Infinity }
    const tFar = { x: Infinity, y: Infinity }

    // X-axis
    if (velocity.x === 0) {
      if (rayOrigin.x < expandedRect.x || rayOrigin.x > expandedRect.x + expandedRect.width) {
        return null
      }
    } else {
      tNear.x = (expandedRect.x - rayOrigin.x) / velocity.x
      tFar.x = (expandedRect.x + expandedRect.width - rayOrigin.x) / velocity.x

      if (tNear.x > tFar.x) {
        ;[tNear.x, tFar.x] = [tFar.x, tNear.x]
      }
    }

    // Y-axis
    if (velocity.y === 0) {
      if (rayOrigin.y < expandedRect.y || rayOrigin.y > expandedRect.y + expandedRect.height) {
        return null
      }
    } else {
      tNear.y = (expandedRect.y - rayOrigin.y) / velocity.y
      tFar.y = (expandedRect.y + expandedRect.height - rayOrigin.y) / velocity.y

      if (tNear.y > tFar.y) {
        ;[tNear.y, tFar.y] = [tFar.y, tNear.y]
      }
    }

    // Check for no collision
    if (tNear.x > tFar.y || tNear.y > tFar.x) {
      return null
    }

    const tHitNear = Math.max(tNear.x, tNear.y)
    const tHitFar = Math.min(tFar.x, tFar.y)

    if (tHitFar < 0 || tHitNear > 1) {
      return null
    }

    // Calculate normal
    const normal: Vector2 = { x: 0, y: 0 }
    if (tNear.x > tNear.y) {
      normal.x = velocity.x < 0 ? 1 : -1
    } else {
      normal.y = velocity.y < 0 ? 1 : -1
    }

    return {
      collisionTime: Math.max(0, tHitNear),
      normal,
    }
  }

  /**
   * Grid-based spatial hashing for efficient collision detection
   */
  static createSpatialGrid<T extends { x: number; y: number; width: number; height: number }>(
    objects: T[],
    cellSize: number
  ): Map<string, T[]> {
    const grid = new Map<string, T[]>()

    for (const obj of objects) {
      const minX = Math.floor(obj.x / cellSize)
      const maxX = Math.floor((obj.x + obj.width) / cellSize)
      const minY = Math.floor(obj.y / cellSize)
      const maxY = Math.floor((obj.y + obj.height) / cellSize)

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const key = `${x},${y}`
          if (!grid.has(key)) {
            grid.set(key, [])
          }
          grid.get(key)!.push(obj)
        }
      }
    }

    return grid
  }

  /**
   * Query spatial grid for potential collisions
   */
  static queryGrid<T extends { x: number; y: number; width: number; height: number }>(
    grid: Map<string, T[]>,
    rect: Rect,
    cellSize: number
  ): T[] {
    const results = new Set<T>()

    const minX = Math.floor(rect.x / cellSize)
    const maxX = Math.floor((rect.x + rect.width) / cellSize)
    const minY = Math.floor(rect.y / cellSize)
    const maxY = Math.floor((rect.y + rect.height) / cellSize)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`
        const cell = grid.get(key)
        if (cell) {
          cell.forEach((obj) => results.add(obj))
        }
      }
    }

    return Array.from(results)
  }
}
