'use client'

import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface GameErrorFallbackProps {
  error: Error
  retry: () => void
}

const GameErrorFallback: React.FC<GameErrorFallbackProps> = ({ error, retry }) => {
  const isNetworkError = error.message.includes('network') || error.message.includes('fetch')
  const isWalletError = error.message.includes('wallet') || error.message.includes('connect')

  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-lg rounded-xl border border-red-500/30 bg-gray-800/90 backdrop-blur-sm p-8 text-white shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl">
            {isNetworkError ? '📡' : isWalletError ? '👛' : '⚠️'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-400">Game Error</h2>
            <p className="text-gray-400 mt-1">
              {isNetworkError
                ? 'Network connection issue'
                : isWalletError
                  ? 'Wallet connection issue'
                  : 'An error occurred'}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-gray-900/80 p-4">
          <p className="text-sm font-mono text-red-300">{error.message}</p>
          {error.stack && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-400">
                View details
              </summary>
              <pre className="mt-2 overflow-x-auto text-xs text-gray-500">{error.stack}</pre>
            </details>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={retry}
            className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          If the problem persists, please refresh the page or contact support
        </p>
      </div>
    </div>
  )
}

interface GameErrorBoundaryProps {
  children: React.ReactNode
  resetKeys?: Array<string | number>
}

export const GameErrorBoundary: React.FC<GameErrorBoundaryProps> = ({ children, resetKeys }) => {
  return (
    <ErrorBoundary
      fallback={(error, retry) => <GameErrorFallback error={error} retry={retry} />}
      onError={(error, errorInfo) => {
        console.error('Game error:', error)
        console.error('Error info:', errorInfo)
        // Here you could send to error tracking service
      }}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  )
}

export default GameErrorBoundary
