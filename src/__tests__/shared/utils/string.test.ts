import {
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  slugify,
  truncate,
  repeat,
} from '@/shared/string'

describe('string utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('WORLD')
    })
  })

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld')
      expect(camelCase('hello-world')).toBe('helloWorld')
      expect(camelCase('hello_world')).toBe('helloWorld')
    })
  })

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('hello world')).toBe('hello_world')
      expect(snakeCase('helloWorld')).toBe('hello_world')
      expect(snakeCase('HelloWorld')).toBe('hello_world')
    })
  })

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('hello world')).toBe('hello-world')
      expect(kebabCase('helloWorld')).toBe('hello-world')
      expect(kebabCase('HelloWorld')).toBe('hello-world')
    })
  })

  describe('slugify', () => {
    it('should create URL-safe slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
      expect(slugify('Special@#$Characters')).toBe('specialcharacters')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('hello world', 5)).toBe('hello...')
      expect(truncate('short', 10)).toBe('short')
    })
  })

  describe('repeat', () => {
    it('should repeat string', () => {
      expect(repeat('x', 3)).toBe('xxx')
      expect(repeat('ab', 2)).toBe('abab')
    })
  })
})
