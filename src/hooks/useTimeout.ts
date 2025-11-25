import { useEffect, useRef } from 'react'

/**
 * useTimeout utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useTimeout.
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback.current(), delay)

    return () => clearTimeout(id)
  }, [delay])
}
