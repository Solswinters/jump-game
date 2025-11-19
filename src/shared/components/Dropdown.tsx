'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { useClickOutside } from '@/shared/hooks'

interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsOpen(false))

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg border bg-gray-700 px-4 py-2 text-left text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-between',
          'border-gray-600'
        )}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span className={cn('transition-transform', isOpen && 'rotate-180')}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  option.value === value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-600',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
