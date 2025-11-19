/**
 * Tests for useToggle hook
 */

import { renderHook, act } from '@testing-library/react'
import { useToggle } from '@/shared/hooks/useToggle'

describe('useToggle', () => {
  it('initializes with false by default', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('initializes with provided initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('toggles value', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(false)
  })

  it('sets value to true', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current[2]()
    })
    expect(result.current[0]).toBe(true)
  })

  it('sets value to false', () => {
    const { result } = renderHook(() => useToggle(true))

    act(() => {
      result.current[3]()
    })
    expect(result.current[0]).toBe(false)
  })
})
