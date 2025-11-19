import type { StateCreator, StoreMutatorIdentifier } from 'zustand'

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options?: {
    name?: string
    enabled?: boolean
  }
) => StateCreator<T, Mps, Mcs>

export const logger: Logger =
  (config, options = {}) =>
  (set, get, api) => {
    const { name = 'store', enabled = process.env.NODE_ENV === 'development' } = options

    if (!enabled) {
      return config(set, get, api)
    }

    return config(
      (partial, replace) => {
        const prevState = get()
        set(partial, replace)
        const nextState = get()

        // eslint-disable-next-line no-console
        console.group(`%c${name}`, 'color: #9E9E9E; font-weight: bold')
        // eslint-disable-next-line no-console
        console.log('%cPrevious State', 'color: #9E9E9E; font-weight: bold', prevState)
        // eslint-disable-next-line no-console
        console.log('%cAction', 'color: #00A7F7; font-weight: bold', partial)
        // eslint-disable-next-line no-console
        console.log('%cNext State', 'color: #47B04B; font-weight: bold', nextState)
        // eslint-disable-next-line no-console
        console.groupEnd()
      },
      get,
      api
    )
  }

export default logger
