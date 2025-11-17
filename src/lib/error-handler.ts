/**
 * Global error handler with logging and reporting
 */

import { logger } from './logger'
import type { AppError } from './errors'

export interface ErrorContext {
  userId?: string
  action?: string
  metadata?: Record<string, unknown>
}

export class ErrorHandler {
  static handle(error: unknown, context?: ErrorContext): void {
    if (error instanceof Error) {
      logger.error(error.message, error, context?.metadata)

      if (context?.action) {
        logger.error(`Error during action: ${context.action}`, error)
      }

      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Send to error tracking service in production
        this.reportError(error, context)
      }
    } else {
      logger.error('Unknown error occurred', undefined, { error, context })
    }
  }

  private static reportError(error: Error, context?: ErrorContext): void {
    // Placeholder for error reporting service integration
    // e.g., Sentry, Rollbar, etc.
    console.error('Error Report:', { error, context })
  }

  static async handleAsync<T>(
    fn: () => Promise<T>,
    fallback?: T,
    context?: ErrorContext
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      this.handle(error, context)
      return fallback
    }
  }

  static handleSync<T>(fn: () => T, fallback?: T, context?: ErrorContext): T | undefined {
    try {
      return fn()
    } catch (error) {
      this.handle(error, context)
      return fallback
    }
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof Error && 'code' in error && 'statusCode' in error
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unknown error occurred'
  }

  static getErrorCode(error: unknown): string {
    if (this.isAppError(error)) {
      return error.code
    }
    return 'UNKNOWN_ERROR'
  }
}

export const handleError = ErrorHandler.handle.bind(ErrorHandler)
export const handleAsyncError = ErrorHandler.handleAsync.bind(ErrorHandler)
export const handleSyncError = ErrorHandler.handleSync.bind(ErrorHandler)
