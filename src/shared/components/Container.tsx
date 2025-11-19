'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
}

export const Container: React.FC<ContainerProps> = ({ children, className, size = 'lg' }) => {
  return (
    <div className={cn('container mx-auto px-4', sizeClasses[size], className)}>{children}</div>
  )
}

export default Container
