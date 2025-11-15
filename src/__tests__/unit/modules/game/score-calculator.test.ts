import { describe, it, expect } from 'vitest'
import {
  calculateTimeScore,
  calculateObstacleScore,
  calculateDifficultyBonus,
  calculateTotalScore,
  getScoreRank,
} from '@/modules/game/utils/score-calculator'

describe('score calculator', () => {
  describe('calculateTimeScore', () => {
    it('should calculate score based on game time', () => {
      expect(calculateTimeScore(10000)).toBe(100) // 10 seconds * 10
      expect(calculateTimeScore(60000)).toBe(600) // 60 seconds * 10
    })

    it('should handle zero time', () => {
      expect(calculateTimeScore(0)).toBe(0)
    })
  })

  describe('calculateObstacleScore', () => {
    it('should calculate score based on obstacles cleared', () => {
      expect(calculateObstacleScore(10)).toBe(50) // 10 * 5
      expect(calculateObstacleScore(100)).toBe(500) // 100 * 5
    })

    it('should handle zero obstacles', () => {
      expect(calculateObstacleScore(0)).toBe(0)
    })
  })

  describe('calculateDifficultyBonus', () => {
    it('should calculate difficulty bonus', () => {
      const baseScore = 1000
      const bonus = calculateDifficultyBonus(2, baseScore)
      expect(bonus).toBeGreaterThan(0)
    })

    it('should return 0 for difficulty 1', () => {
      const baseScore = 1000
      const bonus = calculateDifficultyBonus(1, baseScore)
      expect(bonus).toBe(0)
    })
  })

  describe('calculateTotalScore', () => {
    it('should calculate total score with all components', () => {
      const result = calculateTotalScore(10000, 10, 1, 0)
      expect(result.totalScore).toBeGreaterThan(0)
      expect(result.timeScore).toBe(100)
      expect(result.obstacleScore).toBe(50)
    })

    it('should include difficulty bonus', () => {
      const result1 = calculateTotalScore(10000, 10, 1, 0)
      const result2 = calculateTotalScore(10000, 10, 2, 0)
      expect(result2.difficultyBonus).toBeGreaterThan(result1.difficultyBonus)
    })
  })

  describe('getScoreRank', () => {
    it('should return correct rank for score', () => {
      expect(getScoreRank(10000)).toBe('S')
      expect(getScoreRank(5000)).toBe('A')
      expect(getScoreRank(2500)).toBe('B')
      expect(getScoreRank(1000)).toBe('C')
      expect(getScoreRank(500)).toBe('D')
      expect(getScoreRank(100)).toBe('F')
    })
  })
})
