/**
 * React Error Boundary component
 */

'use client'

import React, { Component, type ReactNode } from 'react'
import { logger } from '../logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    })

    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-bold text-red-900">Something went wrong</h2>
            <p className="text-red-700">Please refresh the page and try again.</p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 overflow-auto rounded bg-red-100 p-4 text-left text-sm text-red-800">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
