/**
 * Screen Shake Effect for impact feedback
 */

export interface ScreenShakeConfig {
  intensity: number
  duration: number
  frequency: number
}

export class ScreenShake {
  private isShaking = false
  private startTime = 0
  private offsetX = 0
  private offsetY = 0
  private config: ScreenShakeConfig = {
    intensity: 5,
    duration: 300,
    frequency: 20,
  }

  start(intensity?: number, duration?: number): void {
    this.isShaking = true
    this.startTime = Date.now()

    if (intensity !== undefined) {
      this.config.intensity = intensity
    }
    if (duration !== undefined) {
      this.config.duration = duration
    }
  }

  stop(): void {
    this.isShaking = false
    this.offsetX = 0
    this.offsetY = 0
  }

  update(): void {
    if (!this.isShaking) return

    const elapsed = Date.now() - this.startTime

    if (elapsed >= this.config.duration) {
      this.stop()
      return
    }

    // Calculate decay factor (0 to 1, decreasing over time)
    const decay = 1 - elapsed / this.config.duration

    // Generate random offset with decay
    const angle = Math.random() * Math.PI * 2
    const distance = this.config.intensity * decay

    this.offsetX = Math.cos(angle) * distance
    this.offsetY = Math.sin(angle) * distance
  }

  apply(ctx: CanvasRenderingContext2D): void {
    if (this.isShaking) {
      ctx.translate(this.offsetX, this.offsetY)
    }
  }

  restore(ctx: CanvasRenderingContext2D): void {
    if (this.isShaking) {
      ctx.translate(-this.offsetX, -this.offsetY)
    }
  }

  getOffset(): { x: number; y: number } {
    return { x: this.offsetX, y: this.offsetY }
  }

  isActive(): boolean {
    return this.isShaking
  }
}
