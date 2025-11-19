/**
 * Tests for useLocalStorage hook
 */

import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('stores and retrieves values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  it('retrieves existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    // Wait for useEffect to run
    expect(result.current[0]).toBe('existing')
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('handles complex objects', () => {
    const obj = { name: 'test', count: 42 }
    const { result } = renderHook(() => useLocalStorage('test-key', obj))

    act(() => {
      result.current[1]({ name: 'updated', count: 100 })
    })

    expect(result.current[0]).toEqual({ name: 'updated', count: 100 })
  })
})
