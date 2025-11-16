import { describe, it, expect } from 'vitest'
import {
  calculateReward,
  formatRewardAmount,
  estimateReward,
  canClaimReward,
  getTimeUntilNextClaim,
  formatCooldownTime,
} from '@/modules/wallet/services/reward-calculator'

describe('reward calculator', () => {
  describe('calculateReward', () => {
    it('should calculate base reward correctly', () => {
      const result = calculateReward(0, false)
      expect(result.baseReward).toBeGreaterThan(BigInt(0))
    })

    it('should add score bonus', () => {
      const result1 = calculateReward(0, false)
      const result2 = calculateReward(1000, false)
      expect(result2.scoreBonus).toBeGreaterThan(result1.scoreBonus)
    })

    it('should add winner bonus', () => {
      const loser = calculateReward(1000, false)
      const winner = calculateReward(1000, true)
      expect(winner.winnerBonus).toBeGreaterThan(BigInt(0))
      expect(winner.totalReward).toBeGreaterThan(loser.totalReward)
    })
  })

  describe('formatRewardAmount', () => {
    it('should format reward amount', () => {
      const amount = BigInt(10) * BigInt(10 ** 18)
      const formatted = formatRewardAmount(amount)
      expect(formatted).toBe('10')
    })

    it('should handle decimals', () => {
      const amount = BigInt(105) * BigInt(10 ** 17) // 10.5
      const formatted = formatRewardAmount(amount)
      expect(formatted).toContain('10.')
    })
  })

  describe('canClaimReward', () => {
    it('should allow claim after cooldown', () => {
      const lastClaim = Math.floor(Date.now() / 1000) - 7200 // 2 hours ago
      expect(canClaimReward(lastClaim, 3600)).toBe(true) // 1 hour cooldown
    })

    it('should prevent claim during cooldown', () => {
      const lastClaim = Math.floor(Date.now() / 1000) - 1800 // 30 min ago
      expect(canClaimReward(lastClaim, 3600)).toBe(false) // 1 hour cooldown
    })
  })

  describe('getTimeUntilNextClaim', () => {
    it('should return 0 when claim is available', () => {
      const lastClaim = Math.floor(Date.now() / 1000) - 7200
      expect(getTimeUntilNextClaim(lastClaim, 3600)).toBe(0)
    })

    it('should return remaining time', () => {
      const lastClaim = Math.floor(Date.now() / 1000) - 1800
      const remaining = getTimeUntilNextClaim(lastClaim, 3600)
      expect(remaining).toBeGreaterThan(0)
      expect(remaining).toBeLessThanOrEqual(1800)
    })
  })

  describe('formatCooldownTime', () => {
    it('should format seconds', () => {
      expect(formatCooldownTime(30)).toBe('30s')
    })

    it('should format minutes', () => {
      const result = formatCooldownTime(90)
      expect(result).toContain('m')
    })

    it('should format hours', () => {
      const result = formatCooldownTime(3660)
      expect(result).toContain('h')
    })

    it('should return "Now" for zero or negative', () => {
      expect(formatCooldownTime(0)).toBe('Now')
      expect(formatCooldownTime(-10)).toBe('Now')
    })
  })
})
