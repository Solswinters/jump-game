/**
 * Performance metrics collection
 */

export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function measureWebVitals(onReport: (metrics: Partial<PerformanceMetrics>) => void) {
  if (typeof window === 'undefined') return

  // FCP
  const fcpObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        onReport({ fcp: entry.startTime })
      }
    }
  })
  fcpObserver.observe({ entryTypes: ['paint'] })

  // LCP
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    onReport({ lcp: lastEntry?.startTime || 0 })
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // FID
  const fidObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as PerformanceEventTiming
        onReport({ fid: fidEntry.processingStart - fidEntry.startTime })
      }
    }
  })
  fidObserver.observe({ entryTypes: ['first-input'] })

  // CLS
  let clsValue = 0
  const clsObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
        onReport({ cls: clsValue })
      }
    }
  })
  clsObserver.observe({ entryTypes: ['layout-shift'] })

  // TTFB
  const navigationEntry = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming
  if (navigationEntry) {
    onReport({ ttfb: navigationEntry.responseStart })
  }
}

export function reportMetrics(metrics: Partial<PerformanceMetrics>) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    console.log('Performance Metrics:', metrics)
    // Here you would send to your analytics service
  }
}
