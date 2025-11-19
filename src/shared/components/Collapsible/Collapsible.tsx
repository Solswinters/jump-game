/**
 * Collapsible section component
 */

'use client'

import { useState } from 'react'

export interface CollapsibleProps {
  title: string | React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  disabled = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-750 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="font-semibold text-white">{title}</div>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="border-t border-gray-700 p-4 text-gray-300">{children}</div>}
    </div>
  )
}
