import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface AlertProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  onClose?: () => void
}

const variantStyles = {
  default:
    'bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700',
  success:
    'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-50 dark:border-green-800',
  warning:
    'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-50 dark:border-yellow-800',
  error:
    'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-50 dark:border-red-800',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-50 dark:border-blue-800',
}

/**
 * Alert utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Alert.
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  children,
  className,
  icon,
  onClose,
}) => {
  return (
    <div
      role="alert"
      className={cn('relative rounded-lg border p-4', variantStyles[variant], className)}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          {title && <div className="mb-1 font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Close alert"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
