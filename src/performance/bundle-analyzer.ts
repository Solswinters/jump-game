/**
 * Bundle size analysis utilities
 */

export interface BundleStats {
  totalSize: number
  gzipSize: number
  chunks: ChunkInfo[]
}

export interface ChunkInfo {
  name: string
  size: number
  modules: string[]
}

export function analyzeBundleSize(): BundleStats {
  // This would integrate with webpack-bundle-analyzer or similar
  // For now, return mock data structure
  return {
    totalSize: 0,
    gzipSize: 0,
    chunks: [],
  }
}

export function detectLargeModules(threshold: number = 100 * 1024): string[] {
  // Detect modules larger than threshold (default 100KB)
  const largeModules: string[] = []

  if (typeof window !== 'undefined' && (window as any).__webpack_modules__) {
    const modules = (window as any).__webpack_modules__
    Object.keys(modules).forEach(key => {
      const moduleSize = JSON.stringify(modules[key]).length
      if (moduleSize > threshold) {
        largeModules.push(`${key} (${(moduleSize / 1024).toFixed(2)}KB)`)
      }
    })
  }

  return largeModules
}

export function suggestCodeSplitting(routes: string[]): string[] {
  // Analyze routes and suggest code splitting opportunities
  const suggestions: string[] = []

  routes.forEach(route => {
    if (!route.includes('dynamic')) {
      suggestions.push(`Consider dynamic import for ${route}`)
    }
  })

  return suggestions
}
