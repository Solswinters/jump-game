/**
 * Empty state component
 */

'use client'

import { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 text-gray-600">
          {typeof icon === 'string' ? <span className="text-6xl">{icon}</span> : icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mb-6 text-sm text-gray-400">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
