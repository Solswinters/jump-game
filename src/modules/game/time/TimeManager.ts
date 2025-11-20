/**
 * Time Manager for game loop timing and time scaling
 */

export class TimeManager {
  private lastTime = 0
  deltaTime = 0
  time = 0
  timeScale = 1
  fps = 60
  private fpsUpdateInterval = 1000
  private lastFpsUpdate = 0
  private frameCount = 0

  update(currentTime: number): void {
    // Calculate delta time
    if (this.lastTime === 0) {
      this.lastTime = currentTime
    }

    const rawDeltaTime = currentTime - this.lastTime
    this.deltaTime = rawDeltaTime * this.timeScale
    this.time += this.deltaTime
    this.lastTime = currentTime

    // Update FPS counter
    this.frameCount++
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round(this.frameCount / ((currentTime - this.lastFpsUpdate) / 1000))
      this.frameCount = 0
      this.lastFpsUpdate = currentTime
    }
  }

  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale)
  }

  pause(): void {
    this.timeScale = 0
  }

  resume(): void {
    this.timeScale = 1
  }

  reset(): void {
    this.lastTime = 0
    this.deltaTime = 0
    this.time = 0
    this.timeScale = 1
    this.frameCount = 0
    this.lastFpsUpdate = 0
  }

  getElapsedSeconds(): number {
    return this.time / 1000
  }

  getFPS(): number {
    return this.fps
  }
}
