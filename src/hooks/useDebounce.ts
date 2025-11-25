/**
 * useDebounce hook for debouncing values
 */

import { useState, useEffect } from 'react'

/**
 * useDebounce utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useDebounce.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
