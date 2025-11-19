import {
  calculateBundleSize,
  shouldCodeSplit,
  getChunkName,
  analyzeModules,
  findDuplicateDependencies,
  suggestOptimizations,
} from '@/lib/performance/bundle'

describe('Performance - Bundle', () => {
  describe('calculateBundleSize', () => {
    it('should calculate bundle size in KB', () => {
      expect(calculateBundleSize(1024)).toBe('1.00 KB')
      expect(calculateBundleSize(2048)).toBe('2.00 KB')
      expect(calculateBundleSize(1536)).toBe('1.50 KB')
    })
  })

  describe('shouldCodeSplit', () => {
    it('should recommend code splitting for large modules', () => {
      expect(shouldCodeSplit(100000)).toBe(true)
      expect(shouldCodeSplit(30000)).toBe(false)
    })

    it('should use custom threshold', () => {
      expect(shouldCodeSplit(60000, 70000)).toBe(false)
      expect(shouldCodeSplit(80000, 70000)).toBe(true)
    })
  })

  describe('getChunkName', () => {
    it('should generate chunk name from route', () => {
      expect(getChunkName('/about')).toBe('about')
      expect(getChunkName('/user/profile')).toBe('user-profile')
      expect(getChunkName('/')).toBe('index')
    })

    it('should sanitize special characters', () => {
      expect(getChunkName('/api/user@123')).toBe('api-user123')
    })
  })

  describe('analyzeModules', () => {
    it('should analyze module usage', () => {
      const modules = [
        { name: 'react', size: 100, used: true },
        { name: 'lodash', size: 200, used: false },
        { name: 'axios', size: 150, used: true },
      ]

      const result = analyzeModules(modules)

      expect(result.total).toBe(3)
      expect(result.used).toBe(2)
      expect(result.unused).toBe(1)
      expect(result.unusedModules).toEqual(['lodash'])
    })
  })

  describe('findDuplicateDependencies', () => {
    it('should find duplicate dependencies', () => {
      const deps = {
        'react@17.0.0': '17.0.0',
        'react@18.0.0': '18.0.0',
        'lodash@4.17.21': '4.17.21',
      }

      const duplicates = findDuplicateDependencies(deps)
      expect(duplicates).toContain('react')
      expect(duplicates).not.toContain('lodash')
    })
  })

  describe('suggestOptimizations', () => {
    it('should suggest code splitting for large bundles', () => {
      const suggestions = suggestOptimizations({
        bundleSize: 250000,
        unusedCode: 10000,
        duplicates: 0,
      })

      expect(suggestions).toContain('Consider code splitting for large bundles')
    })

    it('should suggest removing unused code', () => {
      const suggestions = suggestOptimizations({
        bundleSize: 100000,
        unusedCode: 60000,
        duplicates: 0,
      })

      expect(suggestions).toContain('Remove unused code to reduce bundle size')
    })

    it('should suggest deduplicating dependencies', () => {
      const suggestions = suggestOptimizations({
        bundleSize: 100000,
        unusedCode: 10000,
        duplicates: 2,
      })

      expect(suggestions).toContain('Deduplicate dependencies to reduce bundle size')
    })

    it('should return empty array when no optimizations needed', () => {
      const suggestions = suggestOptimizations({
        bundleSize: 100000,
        unusedCode: 10000,
        duplicates: 0,
      })

      expect(suggestions).toHaveLength(0)
    })
  })
})
