/**
 * Collision detection utilities for game physics
 * Provides various collision detection algorithms
 */

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface Circle {
  x: number
  y: number
  radius: number
}

export interface Point {
  x: number
  y: number
}

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export class GameCollisionUtils {
  /**
   * Check if two rectangles collide (AABB)
   */
  static rectangleRectangle(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  /**
   * Check if two circles collide
   */
  static circleCircle(circle1: Circle, circle2: Circle): boolean {
    const dx = circle2.x - circle1.x
    const dy = circle2.y - circle1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < circle1.radius + circle2.radius
  }

  /**
   * Check if circle and rectangle collide
   */
  static circleRectangle(circle: Circle, rect: Rectangle): boolean {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width))
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height))

    // Calculate distance from circle center to closest point
    const dx = circle.x - closestX
    const dy = circle.y - closestY
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance < circle.radius
  }

  /**
   * Check if point is inside rectangle
   */
  static pointRectangle(point: Point, rect: Rectangle): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    )
  }

  /**
   * Check if point is inside circle
   */
  static pointCircle(point: Point, circle: Circle): boolean {
    const dx = point.x - circle.x
    const dy = point.y - circle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= circle.radius
  }

  /**
   * Check if two lines intersect
   */
  static lineLine(line1: Line, line2: Line): boolean {
    const det =
      (line1.x2 - line1.x1) * (line2.y2 - line2.y1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1)

    if (det === 0) return false // Lines are parallel

    const lambda =
      ((line2.y2 - line2.y1) * (line2.x2 - line1.x1) +
        (line2.x1 - line2.x2) * (line2.y2 - line1.y1)) /
      det

    const gamma =
      ((line1.y1 - line1.y2) * (line2.x2 - line1.x1) +
        (line1.x2 - line1.x1) * (line2.y2 - line1.y1)) /
      det

    return lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1
  }

  /**
   * Check if line intersects rectangle
   */
  static lineRectangle(line: Line, rect: Rectangle): boolean {
    // Check all four sides of the rectangle
    const top: Line = { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y }
    const bottom: Line = {
      x1: rect.x,
      y1: rect.y + rect.height,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    }
    const left: Line = { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height }
    const right: Line = {
      x1: rect.x + rect.width,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    }

    return (
      this.lineLine(line, top) ||
      this.lineLine(line, bottom) ||
      this.lineLine(line, left) ||
      this.lineLine(line, right) ||
      this.pointRectangle({ x: line.x1, y: line.y1 }, rect) ||
      this.pointRectangle({ x: line.x2, y: line.y2 }, rect)
    )
  }

  /**
   * Check if line intersects circle
   */
  static lineCircle(line: Line, circle: Circle): boolean {
    // Check if either endpoint is inside the circle
    if (this.pointCircle({ x: line.x1, y: line.y1 }, circle)) return true
    if (this.pointCircle({ x: line.x2, y: line.y2 }, circle)) return true

    // Calculate closest point on line to circle center
    const len = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))
    const dot =
      ((circle.x - line.x1) * (line.x2 - line.x1) + (circle.y - line.y1) * (line.y2 - line.y1)) /
      Math.pow(len, 2)

    const closestX = line.x1 + dot * (line.x2 - line.x1)
    const closestY = line.y1 + dot * (line.y2 - line.y1)

    // Check if closest point is on the line segment
    const onSegment = this.pointLine({ x: closestX, y: closestY }, line)
    if (!onSegment) return false

    // Check distance
    const dx = closestX - circle.x
    const dy = closestY - circle.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance <= circle.radius
  }

  /**
   * Check if point is on line segment
   */
  static pointLine(point: Point, line: Line): boolean {
    const d1 = Math.sqrt(Math.pow(point.x - line.x1, 2) + Math.pow(point.y - line.y1, 2))
    const d2 = Math.sqrt(Math.pow(point.x - line.x2, 2) + Math.pow(point.y - line.y2, 2))
    const lineLen = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2))

    const buffer = 0.1
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer
  }

  /**
   * Get intersection point of two lines
   */
  static getLineIntersection(line1: Line, line2: Line): Point | null {
    const det =
      (line1.x2 - line1.x1) * (line2.y2 - line2.y1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1)

    if (det === 0) return null // Lines are parallel

    const lambda =
      ((line2.y2 - line2.y1) * (line2.x2 - line1.x1) +
        (line2.x1 - line2.x2) * (line2.y2 - line1.y1)) /
      det

    const gamma =
      ((line1.y1 - line1.y2) * (line2.x2 - line1.x1) +
        (line1.x2 - line1.x1) * (line2.y2 - line1.y1)) /
      det

    if (!(lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1)) return null

    return {
      x: line1.x1 + lambda * (line1.x2 - line1.x1),
      y: line1.y1 + lambda * (line1.y2 - line1.y1),
    }
  }

  /**
   * Get overlap amount between two rectangles
   */
  static getRectangleOverlap(rect1: Rectangle, rect2: Rectangle): Rectangle | null {
    if (!this.rectangleRectangle(rect1, rect2)) return null

    const x = Math.max(rect1.x, rect2.x)
    const y = Math.max(rect1.y, rect2.y)
    const width = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - x
    const height = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - y

    return { x, y, width, height }
  }

  /**
   * Calculate MTV (Minimum Translation Vector) for rectangle collision
   */
  static getRectangleMTV(rect1: Rectangle, rect2: Rectangle): Point | null {
    const overlap = this.getRectangleOverlap(rect1, rect2)
    if (!overlap) return null

    // Determine direction of minimum translation
    const overlapX = overlap.width
    const overlapY = overlap.height

    if (overlapX < overlapY) {
      // Resolve on X axis
      const direction = rect1.x < rect2.x ? -1 : 1
      return { x: overlapX * direction, y: 0 }
    } else {
      // Resolve on Y axis
      const direction = rect1.y < rect2.y ? -1 : 1
      return { x: 0, y: overlapY * direction }
    }
  }

  /**
   * Check polygon collision using SAT (Separating Axis Theorem)
   */
  static polygonPolygon(polygon1: Point[], polygon2: Point[]): boolean {
    const axes = [...this.getPolygonAxes(polygon1), ...this.getPolygonAxes(polygon2)]

    for (const axis of axes) {
      const proj1 = this.projectPolygon(polygon1, axis)
      const proj2 = this.projectPolygon(polygon2, axis)

      if (proj1.max < proj2.min || proj2.max < proj1.min) {
        return false // Found separating axis
      }
    }

    return true
  }

  /**
   * Get axes for SAT collision detection
   */
  private static getPolygonAxes(polygon: Point[]): Point[] {
    const axes: Point[] = []

    for (let i = 0; i < polygon.length; i++) {
      const p1 = polygon[i]
      const p2 = polygon[(i + 1) % polygon.length]

      const edge = { x: p2.x - p1.x, y: p2.y - p1.y }
      const normal = { x: -edge.y, y: edge.x }

      // Normalize
      const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
      axes.push({ x: normal.x / length, y: normal.y / length })
    }

    return axes
  }

  /**
   * Project polygon onto axis
   */
  private static projectPolygon(polygon: Point[], axis: Point): { min: number; max: number } {
    let min = Infinity
    let max = -Infinity

    for (const point of polygon) {
      const projection = point.x * axis.x + point.y * axis.y

      if (projection < min) min = projection
      if (projection > max) max = projection
    }

    return { min, max }
  }

  /**
   * Check if point is inside polygon
   */
  static pointPolygon(point: Point, polygon: Point[]): boolean {
    let inside = false

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x
      const yi = polygon[i].y
      const xj = polygon[j].x
      const yj = polygon[j].y

      const intersect =
        yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi

      if (intersect) inside = !inside
    }

    return inside
  }

  /**
   * Get distance between two points
   */
  static distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Get squared distance (faster, no sqrt)
   */
  static distanceSquared(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return dx * dx + dy * dy
  }

  /**
   * Check if two rectangles overlap with a threshold
   */
  static rectangleRectangleThreshold(
    rect1: Rectangle,
    rect2: Rectangle,
    threshold: number
  ): boolean {
    return (
      rect1.x < rect2.x + rect2.width + threshold &&
      rect1.x + rect1.width + threshold > rect2.x &&
      rect1.y < rect2.y + rect2.height + threshold &&
      rect1.y + rect1.height + threshold > rect2.y
    )
  }

  /**
   * Get center point of rectangle
   */
  static getRectangleCenter(rect: Rectangle): Point {
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    }
  }

  /**
   * Create bounding rectangle from points
   */
  static getBoundingRectangle(points: Point[]): Rectangle {
    if (points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const point of points) {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }
}
