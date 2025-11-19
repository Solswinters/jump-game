/**
 * Radio button component
 */

'use client'

import { InputHTMLAttributes } from 'react'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'value'> {
  options: RadioOption[]
  value?: string
  name: string
  error?: boolean
}

export function RadioGroup({ options, value, name, error, ...props }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            className={`h-4 w-4 border bg-gray-800 text-purple-500 transition-colors focus:ring-2 focus:ring-offset-0 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
            }`}
            {...props}
          />
          <span className={`text-sm ${option.disabled ? 'text-gray-500' : 'text-gray-300'}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
}
