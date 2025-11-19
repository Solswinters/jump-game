/**
 * Tests for validation utilities
 */

import { isEmail, isUrl, isAddress, isEmpty, isNumeric, isInRange } from '@/shared/utils/validation'

describe('validation utilities', () => {
  describe('isEmail', () => {
    it('validates correct emails', () => {
      expect(isEmail('test@example.com')).toBe(true)
      expect(isEmail('user+tag@domain.co.uk')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(isEmail('invalid')).toBe(false)
      expect(isEmail('test@')).toBe(false)
      expect(isEmail('@example.com')).toBe(false)
    })
  })

  describe('isUrl', () => {
    it('validates URLs', () => {
      expect(isUrl('https://example.com')).toBe(true)
      expect(isUrl('http://localhost:3000')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false)
      expect(isUrl('ftp://file.com')).toBe(false)
    })
  })

  describe('isAddress', () => {
    it('validates ethereum addresses', () => {
      expect(isAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toBe(true)
    })

    it('rejects invalid addresses', () => {
      expect(isAddress('0x123')).toBe(false)
      expect(isAddress('not-an-address')).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('detects empty values', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it('detects non-empty values', () => {
      expect(isEmpty('text')).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
    })
  })

  describe('isNumeric', () => {
    it('validates numeric strings', () => {
      expect(isNumeric('123')).toBe(true)
      expect(isNumeric('123.45')).toBe(true)
      expect(isNumeric('-123')).toBe(true)
    })

    it('rejects non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false)
      expect(isNumeric('12a')).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('checks if number is in range', () => {
      expect(isInRange(5, 1, 10)).toBe(true)
      expect(isInRange(1, 1, 10)).toBe(true)
      expect(isInRange(10, 1, 10)).toBe(true)
    })

    it('detects out of range', () => {
      expect(isInRange(0, 1, 10)).toBe(false)
      expect(isInRange(11, 1, 10)).toBe(false)
    })
  })
})
