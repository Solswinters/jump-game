import {
  formatMemorySize,
  MemoryMonitor,
  detectMemoryLeak,
  type MemoryUsage,
} from '@/lib/performance/memory'

describe('Performance - Memory', () => {
  describe('formatMemorySize', () => {
    it('should format bytes to MB', () => {
      expect(formatMemorySize(1024 * 1024)).toBe('1.00 MB')
      expect(formatMemorySize(1024 * 1024 * 2.5)).toBe('2.50 MB')
      expect(formatMemorySize(1024 * 512)).toBe('0.50 MB')
    })
  })

  describe('MemoryMonitor', () => {
    it('should start and stop monitoring', () => {
      const monitor = new MemoryMonitor()
      monitor.start(100)
      expect(monitor['interval']).not.toBeNull()

      monitor.stop()
      expect(monitor['interval']).toBeNull()
    })

    it('should clear readings', () => {
      const monitor = new MemoryMonitor()
      monitor['readings'] = [{ usedJSHeapSize: 100, totalJSHeapSize: 200, jsHeapSizeLimit: 300 }]

      monitor.clear()
      expect(monitor.getReadings()).toHaveLength(0)
    })

    it('should calculate average usage', () => {
      const monitor = new MemoryMonitor()
      monitor['readings'] = [
        { usedJSHeapSize: 100, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
        { usedJSHeapSize: 200, totalJSHeapSize: 300, jsHeapSizeLimit: 400 },
      ]

      const avg = monitor.getAverageUsage()
      expect(avg?.usedJSHeapSize).toBe(150)
      expect(avg?.totalJSHeapSize).toBe(250)
      expect(avg?.jsHeapSizeLimit).toBe(350)
    })

    it('should return null for average with no readings', () => {
      const monitor = new MemoryMonitor()
      expect(monitor.getAverageUsage()).toBeNull()
    })
  })

  describe('detectMemoryLeak', () => {
    it('should detect memory leak when usage increases significantly', () => {
      const readings: MemoryUsage[] = [
        { usedJSHeapSize: 100, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
        { usedJSHeapSize: 120, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
      ]

      expect(detectMemoryLeak(readings, 10)).toBe(true)
    })

    it('should not detect leak when usage is stable', () => {
      const readings: MemoryUsage[] = [
        { usedJSHeapSize: 100, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
        { usedJSHeapSize: 105, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
      ]

      expect(detectMemoryLeak(readings, 10)).toBe(false)
    })

    it('should return false with insufficient readings', () => {
      const readings: MemoryUsage[] = [
        { usedJSHeapSize: 100, totalJSHeapSize: 200, jsHeapSizeLimit: 300 },
      ]

      expect(detectMemoryLeak(readings)).toBe(false)
    })
  })
})
