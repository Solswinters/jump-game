/**
 * Lazy loading utilities
 */

import { lazy } from 'react'

export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: Error = new Error('Unknown error')

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await importFn()
      } catch (error) {
        lastError = error as Error
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    throw lastError
  })
}

export function preloadComponent<T>(
  importFn: () => Promise<{ default: T }>
): (() => Promise<{ default: T }>) & { preload: () => Promise<{ default: T }> } {
  let promise: Promise<{ default: T }> | null = null

  const load = () => {
    if (!promise) {
      promise = importFn()
    }
    return promise
  }

  load.preload = load
  return load
}
