/**
 * In-memory cache implementation with TTL
 */

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of items
}

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class Cache<T = any> {
  private store: Map<string, CacheEntry<T>> = new Map()
  private options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 300000, // 5 minutes default
      maxSize: options.maxSize || 100,
    }
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.store.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    // Enforce max size
    if (this.store.size >= this.options.maxSize) {
      const firstKey = this.store.keys().next().value
      this.store.delete(firstKey)
    }

    const expiresAt = Date.now() + (ttl || this.options.ttl)

    this.store.set(key, {
      value,
      expiresAt,
    })
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key)

    if (!entry) return false

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys())
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats(): {
    size: number
    maxSize: number
    keys: string[]
  } {
    return {
      size: this.size(),
      maxSize: this.options.maxSize,
      keys: this.keys(),
    }
  }
}

/**
 * Create a memoized function with cache
 */
export function memoize<T extends (...args: any[]) => any>(fn: T, options: CacheOptions = {}): T {
  const cache = new Cache<ReturnType<T>>(options)

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)

    return result
  }) as T
}

/**
 * Global cache instance
 */
export const globalCache = new Cache()
