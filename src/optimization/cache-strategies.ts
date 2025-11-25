/**
 * Caching strategies
 */

export type CacheStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate'

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  strategy?: CacheStrategy
}

export class ResourceCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  async get<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const { ttl = 60000, strategy = 'cache-first' } = options

    if (strategy === 'cache-first') {
      const cached = this.getCached<T>(key, ttl)
      if (cached !== null) return cached

      const data = await fetcher()
      this.set(key, data)
      return data
    }

    if (strategy === 'network-first') {
      try {
        const data = await fetcher()
        this.set(key, data)
        return data
      } catch {
        const cached = this.getCached<T>(key, ttl)
        if (cached !== null) return cached
        throw new Error('Network request failed and no cache available')
      }
    }

    if (strategy === 'stale-while-revalidate') {
      const cached = this.getCached<T>(key, ttl)

      // Revalidate in background
      fetcher().then((data) => this.set(key, data))

      if (cached !== null) return cached

      return fetcher()
    }

    return fetcher()
  }

  private getCached<T>(key: string, ttl: number): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  private set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

/**
 * globalCache utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of globalCache.
 */
export const globalCache = new ResourceCache()
