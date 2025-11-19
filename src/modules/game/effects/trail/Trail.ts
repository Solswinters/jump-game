/**
 * Trail effect for player movement
 */

interface TrailPoint {
  x: number
  y: number
  timestamp: number
}

export class Trail {
  private points: TrailPoint[] = []
  private maxPoints: number
  private lifetime: number

  constructor(maxPoints: number = 20, lifetime: number = 500) {
    this.maxPoints = maxPoints
    this.lifetime = lifetime
  }

  addPoint(x: number, y: number): void {
    this.points.push({
      x,
      y,
      timestamp: Date.now(),
    })

    if (this.points.length > this.maxPoints) {
      this.points.shift()
    }
  }

  update(): void {
    const now = Date.now()
    this.points = this.points.filter(point => now - point.timestamp < this.lifetime)
  }

  draw(ctx: CanvasRenderingContext2D, color: string = '#4F46E5'): void {
    if (this.points.length < 2) {
      return
    }

    const now = Date.now()

    for (let i = 0; i < this.points.length - 1; i++) {
      const point = this.points[i]
      const nextPoint = this.points[i + 1]

      if (!point || !nextPoint) {
        continue
      }

      const age = now - point.timestamp
      const alpha = 1 - age / this.lifetime
      const width = alpha * 8 + 2

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.stroke()
      ctx.restore()
    }
  }

  clear(): void {
    this.points = []
  }
}
