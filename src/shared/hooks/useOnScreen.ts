/**
 * Intersection Observer hook
 */

'use client'

import { useState, useEffect, useRef } from 'react'

export function useOnScreen<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
  const [isIntersecting, setIntersecting] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry?.isIntersecting ?? false)
    }, options)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [ref, isIntersecting]
}
