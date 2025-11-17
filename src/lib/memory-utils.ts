/**
 * Memory management and monitoring utilities
 */

export class MemoryUtils {
  /**
   * Get current memory usage (if available)
   */
  static getMemoryUsage(): {
    used: number
    total: number
    percentage: number
  } | null {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return null
    }

    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } })
      .memory
    if (!memory) {return null}

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    }
  }

  /**
   * Format bytes to human-readable string
   */
  static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex] ?? 'B'}`
  }

  /**
   * Check if memory usage is high
   */
  static isMemoryHigh(threshold = 80): boolean {
    const usage = this.getMemoryUsage()
    return usage ? usage.percentage > threshold : false
  }

  /**
   * Create weak reference map for caching
   */
  static createWeakCache<K extends object, V>(): WeakMap<K, V> {
    return new WeakMap<K, V>()
  }

  /**
   * Clear large objects from memory
   */
  static clearObject(obj: Record<string, unknown>): void {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        delete obj[key]
      }
    }
  }
}
