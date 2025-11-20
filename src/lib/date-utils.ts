/**
 * Date and time utilities
 */

export function formatRelativeTime(date: Date | number): string {
  const now = Date.now()
  const then = typeof date === 'number' ? date : date.getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) {
    return 'just now'
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}d ago`
  }
  if (seconds < 2592000) {
    return `${Math.floor(seconds / 604800)}w ago`
  }
  if (seconds < 31536000) {
    return `${Math.floor(seconds / 2592000)}mo ago`
  }
  return `${Math.floor(seconds / 31536000)}y ago`
}

export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

export function addSeconds(date: Date, seconds: number): Date {
  const result = new Date(date)
  result.setSeconds(result.getSeconds() + seconds)
  return result
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

export function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function differenceInHours(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60))
}

export function differenceInMinutes(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60))
}

export function differenceInSeconds(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / 1000)
}

export function startOfWeek(date: Date, startDay = 0): Date {
  const result = startOfDay(date)
  const day = result.getDay()
  const diff = (day < startDay ? 7 : 0) + day - startDay
  result.setDate(result.getDate() - diff)
  return result
}

export function endOfWeek(date: Date, startDay = 0): Date {
  const result = endOfDay(date)
  const day = result.getDay()
  const diff = (day < startDay ? -7 : 0) + 6 - (day - startDay)
  result.setDate(result.getDate() + diff)
  return result
}

export function startOfMonth(date: Date): Date {
  const result = startOfDay(date)
  result.setDate(1)
  return result
}

export function endOfMonth(date: Date): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1, 0)
  result.setHours(23, 59, 59, 999)
  return result
}

export function startOfYear(date: Date): Date {
  const result = startOfDay(date)
  result.setMonth(0, 1)
  return result
}

export function endOfYear(date: Date): Date {
  const result = new Date(date)
  result.setMonth(11, 31)
  result.setHours(23, 59, 59, 999)
  return result
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isWeekday(date: Date): boolean {
  return !isWeekend(date)
}

export function getDayName(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { weekday: 'long' })
}

export function getMonthName(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'long' })
}

export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function isValid(date: Date | number | string): boolean {
  const d = new Date(date)
  return !isNaN(d.getTime())
}

export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime()
}

export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime()
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function fromISODate(isoString: string): Date {
  return new Date(isoString)
}
