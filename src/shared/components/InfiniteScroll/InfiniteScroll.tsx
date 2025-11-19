/**
 * Infinite scroll component
 */

'use client'

import { useRef, useEffect } from 'react'

export interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  threshold?: number
  children: React.ReactNode
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 100,
  children,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loading) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore, loading, threshold])

  return (
    <>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="py-4 text-center">
          {loading && <div className="text-gray-400">Loading more...</div>}
        </div>
      )}
    </>
  )
}
