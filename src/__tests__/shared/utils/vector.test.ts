import {
  add,
  subtract,
  multiply,
  divide,
  magnitude,
  normalize,
  dot,
  distance,
  angle,
  rotate,
} from '@/shared/utils/vector'

describe('Vector Utilities', () => {
  const v1 = { x: 3, y: 4 }
  const v2 = { x: 1, y: 2 }

  describe('add', () => {
    it('should add two vectors', () => {
      expect(add(v1, v2)).toEqual({ x: 4, y: 6 })
    })
  })

  describe('subtract', () => {
    it('should subtract two vectors', () => {
      expect(subtract(v1, v2)).toEqual({ x: 2, y: 2 })
    })
  })

  describe('multiply', () => {
    it('should multiply vector by scalar', () => {
      expect(multiply(v1, 2)).toEqual({ x: 6, y: 8 })
    })
  })

  describe('divide', () => {
    it('should divide vector by scalar', () => {
      expect(divide(v1, 2)).toEqual({ x: 1.5, y: 2 })
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(v1, 0)).toThrow('Division by zero')
    })
  })

  describe('magnitude', () => {
    it('should calculate vector magnitude', () => {
      expect(magnitude(v1)).toBe(5)
      expect(magnitude({ x: 0, y: 0 })).toBe(0)
    })
  })

  describe('normalize', () => {
    it('should normalize vector', () => {
      const normalized = normalize(v1)
      expect(normalized.x).toBeCloseTo(0.6)
      expect(normalized.y).toBeCloseTo(0.8)
      expect(magnitude(normalized)).toBeCloseTo(1)
    })

    it('should handle zero vector', () => {
      expect(normalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
    })
  })

  describe('dot', () => {
    it('should calculate dot product', () => {
      expect(dot(v1, v2)).toBe(11) // 3*1 + 4*2 = 11
    })
  })

  describe('distance', () => {
    it('should calculate distance between vectors', () => {
      expect(distance(v1, v2)).toBeCloseTo(2.828, 2)
    })
  })

  describe('angle', () => {
    it('should calculate angle of vector', () => {
      expect(angle({ x: 1, y: 0 })).toBe(0)
      expect(angle({ x: 0, y: 1 })).toBeCloseTo(Math.PI / 2)
    })
  })

  describe('rotate', () => {
    it('should rotate vector', () => {
      const rotated = rotate({ x: 1, y: 0 }, Math.PI / 2)
      expect(rotated.x).toBeCloseTo(0, 10)
      expect(rotated.y).toBeCloseTo(1)
    })
  })
})
