/**
 * Lazy loading utilities for performance optimization
 */

import dynamic from 'next/dynamic'
import { ComponentType, ReactElement } from 'react'

export interface LazyOptions {
  loading?: () => ReactElement
  ssr?: boolean
  suspense?: boolean
}

/**
 * Lazy load a component with custom options
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): T {
  const { loading, ssr = true, suspense = false } = options

  return dynamic(importFn, {
    loading,
    ssr,
    suspense,
  }) as T
}

/**
 * Lazy load a component with a custom fallback
 */
export function lazyLoadWithFallback<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactElement
): T {
  return lazyLoad(importFn, {
    loading: () => fallback,
    ssr: false,
  })
}

/**
 * Lazy load a component with no SSR
 */
export function lazyLoadClient<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): T {
  return lazyLoad(importFn, { ssr: false })
}

/**
 * Preload a component
 */
export function preloadComponent(importFn: () => Promise<{ default: ComponentType<any> }>): void {
  void importFn()
}
