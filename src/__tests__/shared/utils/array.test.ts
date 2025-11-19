import { chunk, unique, shuffle, groupBy, sortBy, partition } from '@/shared/array'

describe('array utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
      expect(chunk([], 2)).toEqual([])
    })
  })

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })
  })

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffle([...arr])
      expect(shuffled).toHaveLength(arr.length)
      expect(shuffled.sort()).toEqual(arr)
    })
  })

  describe('groupBy', () => {
    it('should group array elements', () => {
      const data = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ]
      const result = groupBy(data, item => item.type)
      expect(result.a).toHaveLength(2)
      expect(result.b).toHaveLength(1)
    })
  })

  describe('sortBy', () => {
    it('should sort by key', () => {
      const data = [{ x: 3 }, { x: 1 }, { x: 2 }]
      const sorted = sortBy(data, item => item.x)
      expect(sorted.map(d => d.x)).toEqual([1, 2, 3])
    })
  })

  describe('partition', () => {
    it('should partition array', () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], x => x % 2 === 0)
      expect(evens).toEqual([2, 4])
      expect(odds).toEqual([1, 3, 5])
    })
  })
})
