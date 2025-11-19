/**
 * Code splitting utilities
 */

import { lazy, ComponentType } from 'react'

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport()
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error('Failed to load component')
  })
}

export function prefetchRoute(route: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = route
  document.head.appendChild(link)
}

export function preloadRoute(route: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'fetch'
  link.href = route
  document.head.appendChild(link)
}

export function getChunkName(route: string): string {
  return route.replace(/\//g, '-').replace(/^-/, '')
}
