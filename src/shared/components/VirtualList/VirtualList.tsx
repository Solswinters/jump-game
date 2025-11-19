/**
 * Virtual list component for performance
 */

'use client'

import { useState, useRef, useEffect } from 'react'

export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)
  const offsetY = startIndex * itemHeight

  const visibleItems = items.slice(startIndex, endIndex)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
