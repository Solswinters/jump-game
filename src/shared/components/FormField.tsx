import React from 'react'
import { cn } from '@/shared/utils/cn'
import { useFormContext } from './Form'

export interface FormFieldProps {
  name: string
  label?: string
  children: React.ReactNode
  className?: string
  required?: boolean
  hint?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  children,
  className,
  required = false,
  hint,
}) => {
  const formContext = useFormContext()
  const error = formContext?.errors[name]

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-900 dark:text-gray-50">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
