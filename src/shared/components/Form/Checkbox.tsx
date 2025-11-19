/**
 * Checkbox component
 */

'use client'

import { InputHTMLAttributes } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string
  error?: boolean
}

export function Checkbox({ label, error, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border bg-gray-800 text-purple-500 transition-colors focus:ring-2 focus:ring-offset-0 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'
        }`}
        {...props}
      />
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}
