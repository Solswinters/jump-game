/**
 * Menu component
 */

'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

export interface MenuItem {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
}

export interface MenuProps {
  trigger: ReactNode
  items: MenuItem[]
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export function Menu({ trigger, items, placement = 'bottom-left' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const placementClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
  }

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <div ref={menuRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 w-48 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-lg ${placementClasses[placement]}`}
          role="menu"
        >
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                item.disabled
                  ? 'cursor-not-allowed text-gray-500'
                  : item.danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-white hover:bg-gray-700'
              }`}
              role="menuitem"
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
