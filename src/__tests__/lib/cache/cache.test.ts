import { Cache, memoize, globalCache } from '@/lib/cache/cache'

describe('Cache', () => {
  let cache: Cache<string>

  beforeEach(() => {
    cache = new Cache<string>({ ttl: 100, maxSize: 3 })
  })

  describe('basic operations', () => {
    it('should set and get values', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull()
    })

    it('should check if key exists', () => {
      cache.set('key1', 'value1')
      expect(cache.has('key1')).toBe(true)
      expect(cache.has('key2')).toBe(false)
    })

    it('should delete keys', () => {
      cache.set('key1', 'value1')
      expect(cache.delete('key1')).toBe(true)
      expect(cache.has('key1')).toBe(false)
    })

    it('should clear all keys', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.clear()
      expect(cache.size()).toBe(0)
    })
  })

  describe('TTL', () => {
    it('should expire entries after TTL', async () => {
      cache.set('key1', 'value1', 50)
      expect(cache.get('key1')).toBe('value1')

      await new Promise(resolve => setTimeout(resolve, 60))
      expect(cache.get('key1')).toBeNull()
    })

    it('should not return expired entries', async () => {
      cache.set('key1', 'value1', 50)
      await new Promise(resolve => setTimeout(resolve, 60))
      expect(cache.has('key1')).toBe(false)
    })
  })

  describe('max size', () => {
    it('should evict oldest entry when max size is reached', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      cache.set('key4', 'value4')

      expect(cache.size()).toBe(3)
      expect(cache.has('key1')).toBe(false)
      expect(cache.has('key4')).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      cache.set('key1', 'value1', 50)
      cache.set('key2', 'value2', 200)

      await new Promise(resolve => setTimeout(resolve, 60))
      cache.cleanup()

      expect(cache.has('key1')).toBe(false)
      expect(cache.has('key2')).toBe(true)
    })
  })

  describe('stats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      const stats = cache.stats()
      expect(stats.size).toBe(2)
      expect(stats.maxSize).toBe(3)
      expect(stats.keys).toContain('key1')
      expect(stats.keys).toContain('key2')
    })
  })
})

describe('memoize', () => {
  it('should memoize function results', () => {
    const fn = jest.fn((x: number) => x * 2)
    const memoized = memoize(fn)

    expect(memoized(5)).toBe(10)
    expect(memoized(5)).toBe(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should cache different arguments separately', () => {
    const fn = jest.fn((x: number) => x * 2)
    const memoized = memoize(fn)

    expect(memoized(5)).toBe(10)
    expect(memoized(10)).toBe(20)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('globalCache', () => {
  afterEach(() => {
    globalCache.clear()
  })

  it('should be a shared cache instance', () => {
    globalCache.set('test', 'value')
    expect(globalCache.get('test')).toBe('value')
  })
})
