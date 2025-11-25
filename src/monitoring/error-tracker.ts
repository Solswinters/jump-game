/**
 * Error tracking and reporting
 */

export interface ErrorContext {
  userId?: string
  sessionId?: string
  route?: string
  userAgent?: string
  [key: string]: unknown
}

export interface TrackedError {
  message: string
  stack?: string
  context: ErrorContext
  timestamp: Date
  fingerprint: string
}

class ErrorTracker {
  private errors: TrackedError[] = []
  private maxErrors = 100

  track(error: Error, context: ErrorContext = {}) {
    const tracked: TrackedError = {
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
      timestamp: new Date(),
      fingerprint: this.generateFingerprint(error),
    }

    this.errors.push(tracked)

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Report to external service
    this.report(tracked)
  }

  private generateFingerprint(error: Error): string {
    const key = `${error.message}-${error.stack?.split('\n')[0] || ''}`
    return btoa(key).slice(0, 32)
  }

  private report(error: TrackedError) {
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, Datadog, or similar
      console.error('Error tracked:', error)
    }
  }

  getErrors(): TrackedError[] {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }

  getErrorsByFingerprint(fingerprint: string): TrackedError[] {
    return this.errors.filter((e) => e.fingerprint === fingerprint)
  }
}

/**
 * errorTracker utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of errorTracker.
 */
export const errorTracker = new ErrorTracker()

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorTracker.track(event.error, {
      type: 'uncaught-error',
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.track(new Error(event.reason), {
      type: 'unhandled-rejection',
    })
  })
}
