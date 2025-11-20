import React, { createContext, useContext, FormEvent } from 'react'
import { cn } from '@/shared/utils/cn'

interface FormContextValue {
  errors: Record<string, string>
}

const FormContext = createContext<FormContextValue | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  return context
}

export interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  className?: string
  errors?: Record<string, string>
}

export const Form: React.FC<FormProps> = ({ onSubmit, children, className, errors = {} }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <FormContext.Provider value={{ errors }}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  )
}
