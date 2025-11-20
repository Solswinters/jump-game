import { lerp, smoothstep, easeInQuad, easeOutQuad, clamp, map } from '@/shared/utils/interpolation'

describe('Interpolation Utilities', () => {
  describe('lerp', () => {
    it('should linearly interpolate between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 10, 1)).toBe(10)
    })
  })

  describe('smoothstep', () => {
    it('should smoothly interpolate between two values', () => {
      expect(smoothstep(0, 10, 0)).toBe(0)
      expect(smoothstep(0, 10, 10)).toBe(1)
    })
  })

  describe('easeInQuad', () => {
    it('should ease in with quadratic function', () => {
      expect(easeInQuad(0)).toBe(0)
      expect(easeInQuad(0.5)).toBe(0.25)
      expect(easeInQuad(1)).toBe(1)
    })
  })

  describe('easeOutQuad', () => {
    it('should ease out with quadratic function', () => {
      expect(easeOutQuad(0)).toBe(0)
      expect(easeOutQuad(1)).toBe(1)
    })
  })

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('map', () => {
    it('should map values from one range to another', () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50)
      expect(map(0, 0, 10, 0, 100)).toBe(0)
      expect(map(10, 0, 10, 0, 100)).toBe(100)
    })
  })
})
