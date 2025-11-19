'use client'

import React, { Suspense } from 'react'

interface LoadingFallbackProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-700 border-t-blue-500`}
        />
        {message && <p className="text-sm text-gray-400">{message}</p>}
      </div>
    </div>
  )
}

export const GameLoadingFallback: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-gray-800 border-t-purple-500 [animation-duration:1.5s]" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">Loading Game...</p>
          <p className="text-sm text-gray-400 mt-2">Preparing the experience</p>
        </div>
      </div>
    </div>
  )
}

export const WalletLoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-700 border-t-green-500" />
        <p className="text-sm text-gray-400">Connecting wallet...</p>
      </div>
    </div>
  )
}

interface LoadingBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  fallback = <LoadingSpinner />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default LoadingBoundary
