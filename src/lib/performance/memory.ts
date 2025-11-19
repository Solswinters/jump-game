/**
 * Memory profiling and optimization utilities
 */

export interface MemoryUsage {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

/**
 * Get current memory usage
 */
export function getMemoryUsage(): MemoryUsage | null {
  if (typeof window === 'undefined') return null

  const performance = window.performance as any

  if (performance && performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    }
  }

  return null
}

/**
 * Calculate memory usage percentage
 */
export function getMemoryUsagePercentage(): number {
  const usage = getMemoryUsage()
  if (!usage) return 0

  return (usage.usedJSHeapSize / usage.jsHeapSizeLimit) * 100
}

/**
 * Check if memory usage is high
 */
export function isMemoryUsageHigh(threshold = 80): boolean {
  return getMemoryUsagePercentage() > threshold
}

/**
 * Format memory size
 */
export function formatMemorySize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

/**
 * Monitor memory usage over time
 */
export class MemoryMonitor {
  private interval: NodeJS.Timeout | null = null
  private readings: MemoryUsage[] = []
  private maxReadings = 100

  start(intervalMs = 5000): void {
    this.stop()

    this.interval = setInterval(() => {
      const usage = getMemoryUsage()
      if (usage) {
        this.readings.push(usage)
        if (this.readings.length > this.maxReadings) {
          this.readings.shift()
        }
      }
    }, intervalMs)
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  getReadings(): MemoryUsage[] {
    return [...this.readings]
  }

  getAverageUsage(): MemoryUsage | null {
    if (this.readings.length === 0) return null

    const sum = this.readings.reduce(
      (acc, reading) => ({
        usedJSHeapSize: acc.usedJSHeapSize + reading.usedJSHeapSize,
        totalJSHeapSize: acc.totalJSHeapSize + reading.totalJSHeapSize,
        jsHeapSizeLimit: acc.jsHeapSizeLimit + reading.jsHeapSizeLimit,
      }),
      { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 }
    )

    const count = this.readings.length

    return {
      usedJSHeapSize: sum.usedJSHeapSize / count,
      totalJSHeapSize: sum.totalJSHeapSize / count,
      jsHeapSizeLimit: sum.jsHeapSizeLimit / count,
    }
  }

  clear(): void {
    this.readings = []
  }
}

/**
 * Detect memory leaks
 */
export function detectMemoryLeak(readings: MemoryUsage[], threshold = 10): boolean {
  if (readings.length < 2) return false

  const first = readings[0].usedJSHeapSize
  const last = readings[readings.length - 1].usedJSHeapSize
  const percentageIncrease = ((last - first) / first) * 100

  return percentageIncrease > threshold
}
