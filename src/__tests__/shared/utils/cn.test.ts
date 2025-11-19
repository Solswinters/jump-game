/**
 * Tests for cn utility
 */

import { cn } from '@/shared/utils/cn'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3')
  })

  it('handles array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})
