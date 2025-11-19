/**
 * Spinner loading component
 */

'use client'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  label?: string
}

export function Spinner({ size = 'md', color = 'border-purple-500', label }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent ${color}`}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  )
}
