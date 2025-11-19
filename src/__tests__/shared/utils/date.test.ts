import {
  formatDate,
  formatTime,
  formatRelative,
  isToday,
  addDays,
  differenceInDays,
} from '@/shared/date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/2024/)
    })
  })

  describe('formatTime', () => {
    it('should format time', () => {
      const date = new Date('2024-01-15T10:30:00')
      const formatted = formatTime(date)
      expect(formatted).toMatch(/10:30/)
    })
  })

  describe('formatRelative', () => {
    it('should format relative time', () => {
      const now = new Date()
      expect(formatRelative(now)).toMatch(/just now|seconds ago/)
    })
  })

  describe('isToday', () => {
    it('should check if date is today', () => {
      expect(isToday(new Date())).toBe(true)
      expect(isToday(new Date('2020-01-01'))).toBe(false)
    })
  })

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-01')
      const result = addDays(date, 5)
      expect(result.getDate()).toBe(6)
    })
  })

  describe('differenceInDays', () => {
    it('should calculate difference in days', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-06')
      expect(differenceInDays(date1, date2)).toBe(5)
    })
  })
})
