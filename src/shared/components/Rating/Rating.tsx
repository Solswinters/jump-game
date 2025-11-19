/**
 * Rating component
 */

'use client'

import { useState } from 'react'

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  allowHalf?: boolean
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  allowHalf = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  const handleClick = (index: number, isHalf: boolean) => {
    if (readonly || !onChange) return
    const newValue = isHalf ? index + 0.5 : index + 1
    onChange(newValue)
  }

  const handleMouseMove = (index: number, e: React.MouseEvent, isHalf: boolean) => {
    if (readonly) return
    const newValue = isHalf ? index + 0.5 : index + 1
    setHoverValue(newValue)
  }

  const getStarFill = (index: number) => {
    const currentValue = hoverValue ?? value
    if (currentValue >= index + 1) return 'full'
    if (currentValue >= index + 0.5) return 'half'
    return 'empty'
  }

  return (
    <div
      className={`inline-flex gap-1 ${readonly ? '' : 'cursor-pointer'}`}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }).map((_, index) => {
        const fill = getStarFill(index)
        return (
          <div
            key={index}
            className={`relative ${sizeClasses[size]}`}
            onMouseMove={e => handleMouseMove(index, e, false)}
            onClick={() => handleClick(index, false)}
          >
            <span className="text-gray-600">★</span>
            {fill === 'full' && <span className="absolute inset-0 text-yellow-500">★</span>}
            {fill === 'half' && (
              <span
                className="absolute inset-0 overflow-hidden text-yellow-500"
                style={{ width: '50%' }}
              >
                ★
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
