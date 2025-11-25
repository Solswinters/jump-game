/**
 * Hook to prevent body scroll (for modals)
 */

import { useEffect } from 'react'

/**
 * usePreventScroll utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of usePreventScroll.
 */
export function usePreventScroll(shouldPrevent: boolean) {
  useEffect(() => {
    if (!shouldPrevent) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [shouldPrevent])
}
