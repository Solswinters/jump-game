import {
  TokenBucketRateLimiter,
  SlidingWindowRateLimiter,
  createRateLimiter,
} from '@/lib/security/rate-limiter'

describe('Security - Rate Limiter', () => {
  describe('TokenBucketRateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 3,
        windowMs: 1000,
      })

      const result1 = limiter.check('user1')
      const result2 = limiter.check('user1')
      const result3 = limiter.check('user1')

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
    })

    it('should block requests exceeding limit', () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 2,
        windowMs: 1000,
      })

      limiter.check('user1')
      limiter.check('user1')
      const result = limiter.check('user1')

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should track remaining requests', () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      })

      const result1 = limiter.check('user1')
      const result2 = limiter.check('user1')

      expect(result1.remaining).toBe(4)
      expect(result2.remaining).toBe(3)
    })

    it('should reset after time window', async () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 1,
        windowMs: 50,
      })

      limiter.check('user1')
      await new Promise(resolve => setTimeout(resolve, 60))

      const result = limiter.check('user1')
      expect(result.allowed).toBe(true)
    })

    it('should track different identifiers separately', () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 1,
        windowMs: 1000,
      })

      limiter.check('user1')
      const result = limiter.check('user2')

      expect(result.allowed).toBe(true)
    })
  })

  describe('SlidingWindowRateLimiter', () => {
    it('should allow requests within limit', () => {
      const limiter = new SlidingWindowRateLimiter({
        maxRequests: 3,
        windowMs: 1000,
      })

      const result1 = limiter.check('user1')
      const result2 = limiter.check('user1')

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
    })

    it('should block requests exceeding limit', () => {
      const limiter = new SlidingWindowRateLimiter({
        maxRequests: 2,
        windowMs: 1000,
      })

      limiter.check('user1')
      limiter.check('user1')
      const result = limiter.check('user1')

      expect(result.allowed).toBe(false)
    })
  })

  describe('createRateLimiter', () => {
    it('should create token bucket rate limiter by default', () => {
      const limiter = createRateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      })

      expect(limiter).toBeInstanceOf(TokenBucketRateLimiter)
    })

    it('should create sliding window rate limiter when specified', () => {
      const limiter = createRateLimiter(
        {
          maxRequests: 5,
          windowMs: 1000,
        },
        'sliding-window'
      )

      expect(limiter).toBeInstanceOf(SlidingWindowRateLimiter)
    })
  })
})
