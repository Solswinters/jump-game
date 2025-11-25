/**
 * useInterval hook for running callbacks at intervals
 */

import { useEffect, useRef } from 'react'

/**
 * useInterval utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useInterval.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
