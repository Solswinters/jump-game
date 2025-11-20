/**
 * Trail Effect for movement visualization
 */

export interface TrailPoint {
  x: number
  y: number
  timestamp: number
  alpha: number
}

export interface TrailConfig {
  maxPoints: number
  lifetime: number
  width: number
  color: string
}

export class TrailEffect {
  private points: TrailPoint[] = []
  private config: TrailConfig

  constructor(config: Partial<TrailConfig> = {}) {
    this.config = {
      maxPoints: 20,
      lifetime: 500,
      width: 3,
      color: '#00ff00',
      ...config,
    }
  }

  addPoint(x: number, y: number): void {
    const now = Date.now()

    this.points.push({
      x,
      y,
      timestamp: now,
      alpha: 1,
    })

    // Remove old points
    this.points = this.points
      .filter((point) => now - point.timestamp < this.config.lifetime)
      .slice(-this.config.maxPoints)
  }

  update(): void {
    const now = Date.now()

    this.points.forEach((point) => {
      const age = now - point.timestamp
      point.alpha = 1 - age / this.config.lifetime
    })
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 2) return

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i]
      const prevPoint = this.points[i - 1]

      ctx.globalAlpha = point.alpha
      ctx.strokeStyle = this.config.color
      ctx.lineWidth = this.config.width * point.alpha

      ctx.beginPath()
      ctx.moveTo(prevPoint.x, prevPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }

    ctx.restore()
  }

  clear(): void {
    this.points = []
  }

  getPointCount(): number {
    return this.points.length
  }
}
