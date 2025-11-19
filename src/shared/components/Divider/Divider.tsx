/**
 * Divider component
 */

'use client'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export function Divider({ orientation = 'horizontal', label, className = '' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full w-px bg-gray-700 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div
        className={`relative flex items-center ${className}`}
        role="separator"
        aria-label={label}
      >
        <div className="flex-grow border-t border-gray-700" />
        <span className="mx-4 text-sm text-gray-400">{label}</span>
        <div className="flex-grow border-t border-gray-700" />
      </div>
    )
  }

  return (
    <hr className={`border-gray-700 ${className}`} role="separator" aria-orientation="horizontal" />
  )
}
