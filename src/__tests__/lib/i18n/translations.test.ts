import { I18n } from '@/lib/i18n'

describe('I18n', () => {
  beforeEach(() => {
    I18n.setLocale('en')
    I18n.loadTranslations('en', {
      hello: 'Hello',
      greeting: 'Hello, {name}!',
      nested: {
        key: 'Nested value',
      },
      items: {
        one: '{count} item',
        other: '{count} items',
      },
    })
  })

  describe('setLocale and getLocale', () => {
    it('should set and get locale', () => {
      I18n.setLocale('es')
      expect(I18n.getLocale()).toBe('es')
    })
  })

  describe('t', () => {
    it('should translate simple key', () => {
      expect(I18n.t('hello')).toBe('Hello')
    })

    it('should translate nested key', () => {
      expect(I18n.t('nested.key')).toBe('Nested value')
    })

    it('should replace parameters', () => {
      expect(I18n.t('greeting', { name: 'World' })).toBe('Hello, World!')
    })

    it('should return key if translation not found', () => {
      expect(I18n.t('missing.key')).toBe('missing.key')
    })
  })

  describe('has', () => {
    it('should check if translation exists', () => {
      expect(I18n.has('hello')).toBe(true)
      expect(I18n.has('nested.key')).toBe(true)
      expect(I18n.has('missing')).toBe(false)
    })
  })

  describe('plural', () => {
    it('should pluralize based on count', () => {
      expect(I18n.plural('items', 1)).toBe('1 item')
      expect(I18n.plural('items', 5)).toBe('5 items')
    })
  })

  describe('formatNumber', () => {
    it('should format number according to locale', () => {
      const result = I18n.formatNumber(1000.5)
      expect(typeof result).toBe('string')
      expect(result).toContain('1')
      expect(result).toContain('0')
    })
  })

  describe('formatDate', () => {
    it('should format date according to locale', () => {
      const date = new Date('2024-01-01T00:00:00Z')
      const result = I18n.formatDate(date)
      expect(typeof result).toBe('string')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency', () => {
      const result = I18n.formatCurrency(100, 'USD')
      expect(typeof result).toBe('string')
      expect(result).toContain('100')
    })
  })
})
