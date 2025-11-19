import type { StateCreator, StoreMutatorIdentifier } from 'zustand'

type PerformanceMonitor = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options?: {
    name?: string
    threshold?: number
    enabled?: boolean
  }
) => StateCreator<T, Mps, Mcs>

export const performanceMonitor: PerformanceMonitor =
  (config, options = {}) =>
  (set, get, api) => {
    const {
      name = 'store',
      threshold = 16, // 16ms = one frame at 60fps
      enabled = process.env.NODE_ENV === 'development',
    } = options

    if (!enabled) {
      return config(set, get, api)
    }

    return config(
      (partial, replace) => {
        const start = performance.now()
        set(partial, replace)
        const end = performance.now()
        const duration = end - start

        if (duration > threshold) {
          // eslint-disable-next-line no-console
          console.warn(
            `%c[${name}] Slow update`,
            'color: #FFA500; font-weight: bold',
            `${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
          )
        }
      },
      get,
      api
    )
  }

export default performanceMonitor
