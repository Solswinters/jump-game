/**
 * Popover component
 */

'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

export interface PopoverProps {
  trigger: ReactNode
  content: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  closeOnClickOutside?: boolean
}

export function Popover({
  trigger,
  content,
  placement = 'bottom',
  closeOnClickOutside = true,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeOnClickOutside])

  const placementClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg ${placementClasses[placement]}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
