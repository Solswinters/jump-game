'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  onClose?: () => void
  className?: string
}

const variantStyles = {
  info: {
    container: 'bg-blue-900/30 border-blue-700',
    icon: '💡',
    title: 'text-blue-400',
    text: 'text-blue-300',
  },
  success: {
    container: 'bg-green-900/30 border-green-700',
    icon: '✓',
    title: 'text-green-400',
    text: 'text-green-300',
  },
  warning: {
    container: 'bg-yellow-900/30 border-yellow-700',
    icon: '⚠',
    title: 'text-yellow-400',
    text: 'text-yellow-300',
  },
  error: {
    container: 'bg-red-900/30 border-red-700',
    icon: '✗',
    title: 'text-red-400',
    text: 'text-red-300',
  },
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onClose,
  className,
}) => {
  const styles = variantStyles[variant]

  return (
    <div className={cn('rounded-lg border p-4', styles.container, className)}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-xl">{styles.icon}</div>
        <div className="flex-1">
          {title && <h4 className={cn('font-semibold mb-1', styles.title)}>{title}</h4>}
          <div className={cn('text-sm', styles.text)}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
