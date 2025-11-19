/**
 * Lazy loading image component
 */

'use client'

import { useState } from 'react'
import { useOnScreen } from '@/shared/hooks/useOnScreen'

export interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3C/svg%3E',
}: LazyImageProps) {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isVisible && (
        <img
          src={error ? placeholder : src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {!isLoaded && !error && <div className="absolute inset-0 animate-pulse bg-gray-700" />}
    </div>
  )
}
