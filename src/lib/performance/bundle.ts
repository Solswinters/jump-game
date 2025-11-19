/**
 * Bundle analysis and optimization utilities
 */

/**
 * Calculate bundle size in KB
 */
export function calculateBundleSize(bytes: number): string {
  const kb = bytes / 1024
  return `${kb.toFixed(2)} KB`
}

/**
 * Check if code splitting is beneficial
 */
export function shouldCodeSplit(moduleSize: number, threshold = 50000): boolean {
  return moduleSize > threshold
}

/**
 * Get route-based chunk name
 */
export function getChunkName(route: string): string {
  return (
    route
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase() || 'index'
  )
}

/**
 * Analyze module usage
 */
export interface ModuleStats {
  name: string
  size: number
  used: boolean
}

export function analyzeModules(modules: ModuleStats[]): {
  total: number
  used: number
  unused: number
  unusedModules: string[]
} {
  const total = modules.length
  const usedModules = modules.filter(m => m.used)
  const unusedModules = modules.filter(m => !m.used)

  return {
    total,
    used: usedModules.length,
    unused: unusedModules.length,
    unusedModules: unusedModules.map(m => m.name),
  }
}

/**
 * Check for duplicate dependencies
 */
export function findDuplicateDependencies(dependencies: Record<string, string>): string[] {
  const versions = new Map<string, Set<string>>()

  Object.entries(dependencies).forEach(([name, version]) => {
    const baseName = name.split('@')[0]
    if (!versions.has(baseName)) {
      versions.set(baseName, new Set())
    }
    versions.get(baseName)!.add(version)
  })

  return Array.from(versions.entries())
    .filter(([, versionSet]) => versionSet.size > 1)
    .map(([name]) => name)
}

/**
 * Suggest bundle optimization strategies
 */
export function suggestOptimizations(stats: {
  bundleSize: number
  unusedCode: number
  duplicates: number
}): string[] {
  const suggestions: string[] = []

  if (stats.bundleSize > 200000) {
    suggestions.push('Consider code splitting for large bundles')
  }

  if (stats.unusedCode > 50000) {
    suggestions.push('Remove unused code to reduce bundle size')
  }

  if (stats.duplicates > 0) {
    suggestions.push('Deduplicate dependencies to reduce bundle size')
  }

  return suggestions
}
