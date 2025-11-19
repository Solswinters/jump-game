import { clamp, lerp, randomInt, randomFloat, percentage, average, sum } from '@/shared/math'

describe('math utilities', () => {
  describe('clamp', () => {
    it('should clamp values', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('lerp', () => {
    it('should interpolate linearly', () => {
      expect(lerp(0, 100, 0)).toBe(0)
      expect(lerp(0, 100, 0.5)).toBe(50)
      expect(lerp(0, 100, 1)).toBe(100)
    })
  })

  describe('randomInt', () => {
    it('should generate random integer', () => {
      const result = randomInt(1, 10)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(10)
      expect(Number.isInteger(result)).toBe(true)
    })
  })

  describe('randomFloat', () => {
    it('should generate random float', () => {
      const result = randomFloat(0, 1)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(1)
    })
  })

  describe('percentage', () => {
    it('should calculate percentage', () => {
      expect(percentage(50, 100)).toBe(50)
      expect(percentage(25, 50)).toBe(50)
      expect(percentage(0, 100)).toBe(0)
    })
  })

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3)
      expect(average([10, 20])).toBe(15)
    })
  })

  describe('sum', () => {
    it('should calculate sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15)
      expect(sum([])).toBe(0)
    })
  })
})
