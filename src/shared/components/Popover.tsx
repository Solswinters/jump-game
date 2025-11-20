import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'
import { useClickOutside } from '@/hooks/useClickOutside'

export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useClickOutside(popoverRef, () => setIsOpen(false))

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[200px] rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800',
            positionClasses[position],
            className
          )}
          role="dialog"
        >
          {content}
        </div>
      )}
    </div>
  )
}
