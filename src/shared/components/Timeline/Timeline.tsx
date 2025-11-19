/**
 * Timeline component
 */

'use client'

import { ReactNode } from 'react'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: ReactNode
  status?: 'completed' | 'active' | 'pending'
}

export interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  item.status === 'completed'
                    ? 'border-green-500 bg-green-500'
                    : item.status === 'active'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600 bg-gray-800'
                }`}
              >
                {item.icon || (
                  <span className="text-white">{item.status === 'completed' ? '✓' : ''}</span>
                )}
              </div>
              {!isLast && <div className="my-2 h-full w-0.5 flex-1 bg-gray-700" />}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
