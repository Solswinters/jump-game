import {
  randomInt,
  randomFloat,
  randomBool,
  randomChoice,
  shuffle,
  SeededRandom,
} from '@/shared/utils/random'

describe('Random Utilities', () => {
  describe('randomInt', () => {
    it('should generate random integer within range', () => {
      const value = randomInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
      expect(Number.isInteger(value)).toBe(true)
    })
  })

  describe('randomFloat', () => {
    it('should generate random float within range', () => {
      const value = randomFloat(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    })
  })

  describe('randomBool', () => {
    it('should generate random boolean', () => {
      const value = randomBool()
      expect(typeof value).toBe('boolean')
    })

    it('should respect probability', () => {
      const alwaysTrue = randomBool(1)
      const alwaysFalse = randomBool(0)
      expect(alwaysTrue).toBe(true)
      expect(alwaysFalse).toBe(false)
    })
  })

  describe('randomChoice', () => {
    it('should choose random element from array', () => {
      const array = [1, 2, 3, 4, 5]
      const choice = randomChoice(array)
      expect(array).toContain(choice)
    })

    it('should return undefined for empty array', () => {
      expect(randomChoice([])).toBeUndefined()
    })
  })

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const array = [1, 2, 3, 4, 5]
      const shuffled = shuffle(array)
      expect(shuffled).toHaveLength(array.length)
      expect(shuffled.sort()).toEqual(array)
    })

    it('should not mutate original array', () => {
      const array = [1, 2, 3]
      const original = [...array]
      shuffle(array)
      expect(array).toEqual(original)
    })
  })

  describe('SeededRandom', () => {
    it('should generate consistent sequence with same seed', () => {
      const rng1 = new SeededRandom(42)
      const rng2 = new SeededRandom(42)

      expect(rng1.next()).toBe(rng2.next())
      expect(rng1.next()).toBe(rng2.next())
    })

    it('should generate different sequences with different seeds', () => {
      const rng1 = new SeededRandom(42)
      const rng2 = new SeededRandom(123)

      expect(rng1.next()).not.toBe(rng2.next())
    })

    it('should generate integers within range', () => {
      const rng = new SeededRandom(42)
      const value = rng.nextInt(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
      expect(Number.isInteger(value)).toBe(true)
    })

    it('should generate floats within range', () => {
      const rng = new SeededRandom(42)
      const value = rng.nextFloat(1, 10)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    })
  })
})
