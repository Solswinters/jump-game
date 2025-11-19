/**
 * Multiplayer utils tests
 */

import { describe, it, expect } from '@jest/globals'
import {
  calculateBackoff,
  calculateMatchQuality,
  calculateELO,
  formatDuration,
  validateRoomCode,
  validateUsername,
} from '../utils'

describe('Reconnection Utils', () => {
  it('should calculate exponential backoff', () => {
    const delay1 = calculateBackoff(0, 1000, 30000, 2, false)
    const delay2 = calculateBackoff(1, 1000, 30000, 2, false)
    const delay3 = calculateBackoff(2, 1000, 30000, 2, false)

    expect(delay1).toBe(1000)
    expect(delay2).toBe(2000)
    expect(delay3).toBe(4000)
  })

  it('should respect max delay', () => {
    const delay = calculateBackoff(10, 1000, 5000, 2, false)
    expect(delay).toBe(5000)
  })
})

describe('Matchmaking Utils', () => {
  it('should calculate match quality', () => {
    const players = [
      { id: '1', rating: 1500, region: 'NA', waitTime: 0 },
      { id: '2', rating: 1510, region: 'NA', waitTime: 0 },
    ]

    const quality = calculateMatchQuality(players)
    expect(quality).toBeGreaterThan(0.9) // Very close ratings = high quality
  })

  it('should return 0 for insufficient players', () => {
    const quality = calculateMatchQuality([])
    expect(quality).toBe(0)
  })
})

describe('Score Utils', () => {
  it('should calculate ELO correctly', () => {
    const newRating = calculateELO(1500, 1500, 'win', 32)
    expect(newRating).toBeGreaterThan(1500)
  })

  it('should decrease rating on loss', () => {
    const newRating = calculateELO(1500, 1500, 'loss', 32)
    expect(newRating).toBeLessThan(1500)
  })
})

describe('Format Utils', () => {
  it('should format duration correctly', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(3665)).toBe('1:01:05')
  })

  it('should format short durations', () => {
    expect(formatDuration(5)).toBe('0:05')
  })
})

describe('Validation Utils', () => {
  it('should validate room codes', () => {
    expect(validateRoomCode('ABC123')).toBe(true)
    expect(validateRoomCode('abc123')).toBe(false)
    expect(validateRoomCode('ABC12')).toBe(false)
  })

  it('should validate usernames', () => {
    expect(validateUsername('user123')).toBe(true)
    expect(validateUsername('a')).toBe(false)
    expect(validateUsername('user@123')).toBe(false)
  })
})
