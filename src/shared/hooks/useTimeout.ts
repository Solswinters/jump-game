/**
 * Timeout hook with automatic cleanup
 */

'use client'

import { useEffect, useRef } from 'react'

export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => {
      savedCallback.current?.()
    }, delay)

    return () => clearTimeout(id)
  }, [delay])
}
