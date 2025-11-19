/**
 * Textarea component
 */

'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  error?: boolean
  resize?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, resize = true, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`block w-full rounded-lg border bg-gray-800 px-4 py-2 text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${
          resize ? '' : 'resize-none'
        } ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
