/**
 * Tests for format utilities
 */

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  formatAddress,
  formatDuration,
} from '@/shared/utils/format'

describe('format utilities', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    it('handles decimals', () => {
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57')
    })
  })

  describe('formatCurrency', () => {
    it('formats USD by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('formats other currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toContain('1,234.56')
    })
  })

  describe('formatPercentage', () => {
    it('formats percentages', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%')
      expect(formatPercentage(0.5)).toBe('50.00%')
    })
  })

  describe('formatAddress', () => {
    it('truncates ethereum addresses', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      expect(formatAddress(address)).toBe('0x742d...f0bEb')
    })

    it('handles short addresses', () => {
      expect(formatAddress('0x123')).toBe('0x123')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds', () => {
      expect(formatDuration(30)).toBe('0:30')
    })

    it('formats minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1:30')
    })

    it('formats hours', () => {
      expect(formatDuration(3661)).toBe('1:01:01')
    })
  })
})
