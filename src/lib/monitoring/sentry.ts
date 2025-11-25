/**
 * Sentry error tracking configuration
 */

import * as Sentry from '@sentry/nextjs'

/**
 * initSentry utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of initSentry.
 */
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      debug: false,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
    })
  }
}

/**
 * captureException utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of captureException.
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * captureMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of captureMessage.
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}

/**
 * setUser utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of setUser.
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user)
}

/**
 * clearUser utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of clearUser.
 */
export function clearUser() {
  Sentry.setUser(null)
}
