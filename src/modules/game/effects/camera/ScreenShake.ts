/**
 * Screen shake effect for impacts
 */

export class ScreenShake {
  private intensity: number = 0
  private duration: number = 0
  private elapsed: number = 0
  private offsetX: number = 0
  private offsetY: number = 0

  shake(intensity: number, duration: number): void {
    this.intensity = Math.max(this.intensity, intensity)
    this.duration = duration
    this.elapsed = 0
  }

  update(deltaTime: number): void {
    if (this.elapsed < this.duration) {
      this.elapsed += deltaTime

      const progress = this.elapsed / this.duration
      const currentIntensity = this.intensity * (1 - progress)

      this.offsetX = (Math.random() - 0.5) * currentIntensity * 2
      this.offsetY = (Math.random() - 0.5) * currentIntensity * 2
    } else {
      this.offsetX = 0
      this.offsetY = 0
    }
  }

  getOffset(): { x: number; y: number } {
    return {
      x: this.offsetX,
      y: this.offsetY,
    }
  }

  isActive(): boolean {
    return this.elapsed < this.duration
  }

  reset(): void {
    this.intensity = 0
    this.duration = 0
    this.elapsed = 0
    this.offsetX = 0
    this.offsetY = 0
  }
}
