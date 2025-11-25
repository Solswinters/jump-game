/**
 * Memory profiling utilities
 */

export interface MemoryStats {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  percentage: number
}

/**
 * getMemoryUsage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getMemoryUsage.
 */
export function getMemoryUsage(): MemoryStats | null {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null
  }

  const memory = (performance as any).memory
  const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    percentage,
  }
}

/**
 * monitorMemoryLeaks utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of monitorMemoryLeaks.
 */
export function monitorMemoryLeaks(interval: number = 5000) {
  const measurements: MemoryStats[] = []

  const intervalId = setInterval(() => {
    const stats = getMemoryUsage()
    if (stats) {
      measurements.push(stats)

      // Keep only last 20 measurements
      if (measurements.length > 20) {
        measurements.shift()
      }

      // Check for consistent growth
      if (measurements.length >= 5) {
        const recent = measurements.slice(-5)
        const isGrowing = recent.every((stat, i) => {
          if (i === 0) return true
          return stat.usedJSHeapSize > recent[i - 1]!.usedJSHeapSize
        })

        if (isGrowing) {
          console.warn('Potential memory leak detected')
        }
      }
    }
  }, interval)

  return () => clearInterval(intervalId)
}

/**
 * findMemoryLeaks utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of findMemoryLeaks.
 */
export function findMemoryLeaks(): string[] {
  const leaks: string[] = []

  // Check for common memory leak patterns
  if (typeof window !== 'undefined') {
    // Check for event listeners
    const eventListenerCount = (window as any)._eventListeners?.length || 0
    if (eventListenerCount > 100) {
      leaks.push(`High event listener count: ${eventListenerCount}`)
    }

    // Check for detached DOM nodes
    if (document.querySelectorAll('*').length > 5000) {
      leaks.push('High DOM node count - potential detached nodes')
    }
  }

  return leaks
}
