/**
 * Rate limiter middleware
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RequestRecord {
  count: number
  resetAt: number
}

export class RateLimiter {
  private records: Map<string, RequestRecord> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    this.startCleanup()
  }

  check(key: string): boolean {
    const now = Date.now()
    const record = this.records.get(key)

    if (!record || now >= record.resetAt) {
      this.records.set(key, {
        count: 1,
        resetAt: now + this.config.windowMs,
      })
      return true
    }

    if (record.count >= this.config.maxRequests) {
      return false
    }

    record.count++
    return true
  }

  reset(key: string): void {
    this.records.delete(key)
  }

  resetAll(): void {
    this.records.clear()
  }

  getRemainingRequests(key: string): number {
    const record = this.records.get(key)
    if (!record || Date.now() >= record.resetAt) {
      return this.config.maxRequests
    }
    return Math.max(0, this.config.maxRequests - record.count)
  }

  getResetTime(key: string): number | null {
    const record = this.records.get(key)
    if (!record || Date.now() >= record.resetAt) {
      return null
    }
    return record.resetAt
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, record] of this.records.entries()) {
        if (now >= record.resetAt) {
          this.records.delete(key)
        }
      }
    }, this.config.windowMs)
  }
}
