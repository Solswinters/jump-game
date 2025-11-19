/**
 * Notification banner component
 */

'use client'

import { ReactNode } from 'react'

export interface NotificationProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  icon?: ReactNode
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function Notification({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  action,
}: NotificationProps) {
  const typeStyles = {
    info: 'bg-blue-500/10 border-blue-500 text-blue-400',
    success: 'bg-green-500/10 border-green-500 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
    error: 'bg-red-500/10 border-red-500 text-red-400',
  }

  return (
    <div className={`rounded-lg border-l-4 p-4 ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xl opacity-60 hover:opacity-100">
            ×
          </button>
        )}
      </div>
    </div>
  )
}
