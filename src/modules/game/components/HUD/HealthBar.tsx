/**
 * Health bar component
 */

'use client'

export interface HealthBarProps {
  current: number
  max: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

/**
 * HealthBar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of HealthBar.
 */
export function HealthBar({
  current,
  max,
  showText = true,
  size = 'md',
  animated = true,
}: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }

  const getColor = () => {
    if (percentage > 60) return 'bg-green-500'
    if (percentage > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="w-full">
      {showText && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gray-300">Health</span>
          <span className="font-mono text-gray-400">
            {current}/{max}
          </span>
        </div>
      )}
      <div className={`relative overflow-hidden rounded-full bg-gray-700 ${sizeClasses[size]}`}>
        <div
          className={`h-full ${getColor()} ${animated ? 'transition-all duration-300' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  )
}
