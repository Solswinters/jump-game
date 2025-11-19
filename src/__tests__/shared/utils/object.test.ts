import { deepClone, deepMerge, pick, omit, isEmpty, isEqual } from '@/shared/object'

describe('object utilities', () => {
  describe('deepClone', () => {
    it('should create deep copy', () => {
      const obj = { a: 1, b: { c: 2 } }
      const clone = deepClone(obj)
      expect(clone).toEqual(obj)
      expect(clone).not.toBe(obj)
      expect(clone.b).not.toBe(obj.b)
    })
  })

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } }
      const obj2 = { b: { d: 3 }, e: 4 }
      const result = deepMerge(obj1, obj2)
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
    })
  })

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('isEmpty', () => {
    it('should check if object is empty', () => {
      expect(isEmpty({})).toBe(true)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty([1])).toBe(false)
    })
  })

  describe('isEqual', () => {
    it('should check deep equality', () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true)
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    })
  })
})
