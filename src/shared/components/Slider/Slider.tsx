/**
 * Slider component
 */

'use client'

import { useState, useRef, useEffect } from 'react'

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  showValue?: boolean
  disabled?: boolean
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  showValue = true,
  disabled = false,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseDown = () => {
    if (!disabled) setIsDragging(true)
  }

  const updateValue = (clientX: number) => {
    if (!sliderRef.current || disabled) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newValue = min + percentage * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    onChange(Math.max(min, Math.min(max, steppedValue)))
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX)
    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showValue && <span className="font-mono text-gray-400">{value}</span>}
        </div>
      )}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onClick={e => updateValue(e.clientX)}
        className={`relative h-2 rounded-full bg-gray-700 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <div
          className="absolute h-full rounded-full bg-purple-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all hover:scale-110"
          style={{ left: `calc(${percentage}% - 0.5rem)` }}
        />
      </div>
    </div>
  )
}
