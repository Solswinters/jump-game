'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface StatProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
}

export const Stat: React.FC<StatProps> = ({ label, value, icon, trend, trendValue, className }) => {
  return (
    <div className={cn('rounded-lg bg-gray-800 border border-gray-700 p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && trendValue && (
          <div className={cn('flex items-center gap-1 text-sm', trendColors[trend])}>
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stat
