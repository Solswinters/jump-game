/**
 * Performance Monitor - Separate performance tracking from game loop
 * Refactored for better separation of concerns
 */

export interface PerformanceMetrics {
  fps: number
  averageFPS: number
  minFPS: number
  maxFPS: number
  frameTime: number
  updateTime: number
  renderTime: number
  totalFrames: number
  droppedFrames: number
  timestamp: number
}

export interface PerformanceSnapshot {
  timestamp: number
  fps: number
  frameTime: number
}

export class PerformanceMonitor {
  private fpsBuffer: number[] = []
  private readonly FPS_BUFFER_SIZE = 60
  private currentFPS: number = 0
  private minFPS: number = Infinity
  private maxFPS: number = 0
  private droppedFrames: number = 0
  private lastFpsUpdate: number = 0
  private fpsAccumulator: number = 0
  private frameCount: number = 0
  private updateTime: number = 0
  private renderTime: number = 0
  private snapshots: PerformanceSnapshot[] = []
  private readonly MAX_SNAPSHOTS = 300

  /**
   * Record frame time
   */
  recordFrame(deltaTime: number): void {
    this.frameCount++
    this.fpsAccumulator++

    const now = performance.now()

    // Update FPS every second
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFPS = Math.round((this.fpsAccumulator * 1000) / (now - this.lastFpsUpdate))

      this.fpsBuffer.push(this.currentFPS)
      if (this.fpsBuffer.length > this.FPS_BUFFER_SIZE) {
        this.fpsBuffer.shift()
      }

      // Track min/max FPS
      if (this.currentFPS < this.minFPS) this.minFPS = this.currentFPS
      if (this.currentFPS > this.maxFPS) this.maxFPS = this.currentFPS

      // Record snapshot
      this.recordSnapshot(now, this.currentFPS, deltaTime)

      this.fpsAccumulator = 0
      this.lastFpsUpdate = now
    }
  }

  /**
   * Record performance snapshot
   */
  private recordSnapshot(timestamp: number, fps: number, frameTime: number): void {
    this.snapshots.push({ timestamp, fps, frameTime })

    if (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift()
    }
  }

  /**
   * Record dropped frame
   */
  recordDroppedFrame(): void {
    this.droppedFrames++
  }

  /**
   * Record update time
   */
  recordUpdateTime(time: number): void {
    this.updateTime = time
  }

  /**
   * Record render time
   */
  recordRenderTime(time: number): void {
    this.renderTime = time
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.currentFPS,
      averageFPS: this.getAverageFPS(),
      minFPS: this.minFPS === Infinity ? 0 : this.minFPS,
      maxFPS: this.maxFPS,
      frameTime: this.updateTime + this.renderTime,
      updateTime: this.updateTime,
      renderTime: this.renderTime,
      totalFrames: this.frameCount,
      droppedFrames: this.droppedFrames,
      timestamp: performance.now(),
    }
  }

  /**
   * Get average FPS
   */
  getAverageFPS(): number {
    if (this.fpsBuffer.length === 0) return 0

    const sum = this.fpsBuffer.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.fpsBuffer.length)
  }

  /**
   * Get FPS history
   */
  getFPSHistory(): number[] {
    return [...this.fpsBuffer]
  }

  /**
   * Get performance snapshots
   */
  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots]
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    avgFPS: number
    minFPS: number
    maxFPS: number
    stability: number
    droppedFrames: number
  } {
    const avgFPS = this.getAverageFPS()
    const variance = this.calculateFPSVariance()

    return {
      avgFPS,
      minFPS: this.minFPS === Infinity ? 0 : this.minFPS,
      maxFPS: this.maxFPS,
      stability: variance > 0 ? Math.max(0, 100 - variance) : 100,
      droppedFrames: this.droppedFrames,
    }
  }

  /**
   * Calculate FPS variance
   */
  private calculateFPSVariance(): number {
    if (this.fpsBuffer.length < 2) return 0

    const avg = this.getAverageFPS()
    const squaredDiffs = this.fpsBuffer.map((fps) => Math.pow(fps - avg, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / this.fpsBuffer.length

    return Math.sqrt(variance)
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(threshold: number = 55): boolean {
    return this.currentFPS >= threshold && this.droppedFrames < this.frameCount * 0.05
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.fpsBuffer = []
    this.currentFPS = 0
    this.minFPS = Infinity
    this.maxFPS = 0
    this.droppedFrames = 0
    this.lastFpsUpdate = 0
    this.fpsAccumulator = 0
    this.frameCount = 0
    this.updateTime = 0
    this.renderTime = 0
    this.snapshots = []
  }

  /**
   * Export performance data
   */
  exportData(): {
    metrics: PerformanceMetrics
    summary: ReturnType<typeof this.getSummary>
    snapshots: PerformanceSnapshot[]
  } {
    return {
      metrics: this.getMetrics(),
      summary: this.getSummary(),
      snapshots: this.getSnapshots(),
    }
  }
}

export default PerformanceMonitor
