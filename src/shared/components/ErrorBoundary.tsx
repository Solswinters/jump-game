'use client'

import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, retry: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      !this.arraysEqual(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset()
    }
  }

  arraysEqual(a: Array<string | number>, b: Array<string | number>) {
    return a.length === b.length && a.every((val, index) => val === b[index])
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.reset)
      }

      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
          <div className="w-full max-w-md rounded-lg border border-red-500/20 bg-gray-800 p-6 text-white">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-2xl">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
                <p className="text-sm text-gray-400">An unexpected error occurred</p>
              </div>
            </div>

            <div className="mb-4 rounded bg-gray-900 p-3">
              <p className="text-sm font-mono text-red-300">{this.state.error.message}</p>
            </div>

            <button
              onClick={this.reset}
              className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
