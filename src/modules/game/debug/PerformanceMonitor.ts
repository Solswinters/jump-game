/**
 * Performance monitoring for game
 */

export interface PerformanceMetrics {
  updateTime: number
  renderTime: number
  totalTime: number
  memoryUsage: number
  frameCount: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    updateTime: 0,
    renderTime: 0,
    totalTime: 0,
    memoryUsage: 0,
    frameCount: 0,
  }

  private updateStart: number = 0
  private renderStart: number = 0

  startUpdate(): void {
    this.updateStart = performance.now()
  }

  endUpdate(): void {
    this.metrics.updateTime = performance.now() - this.updateStart
  }

  startRender(): void {
    this.renderStart = performance.now()
  }

  endRender(): void {
    this.metrics.renderTime = performance.now() - this.renderStart
    this.metrics.totalTime = this.metrics.updateTime + this.metrics.renderTime
    this.metrics.frameCount++

    // Update memory usage if available
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  reset(): void {
    this.metrics = {
      updateTime: 0,
      renderTime: 0,
      totalTime: 0,
      memoryUsage: 0,
      frameCount: 0,
    }
  }

  getAverageFrameTime(): number {
    return this.metrics.totalTime
  }

  getFPS(): number {
    return this.metrics.totalTime > 0 ? 1000 / this.metrics.totalTime : 60
  }
}

export const performanceMonitorGame = new PerformanceMonitor()
