/**
 * Function-related type utilities
 */

export type AnyFunction = (...args: unknown[]) => unknown

export type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>

export type VoidFunction = () => void

export type AsyncVoidFunction = () => Promise<void>

export type Callback<T = void> = (data: T) => void

export type AsyncCallback<T = void> = (data: T) => Promise<void>

export type UnsubscribeFn = () => void

export type EventHandler<T = unknown> = (event: T) => void

export type ErrorHandler = (error: Error) => void

export type Predicate<T> = (value: T) => boolean

export type AsyncPredicate<T> = (value: T) => Promise<boolean>

export type Comparator<T> = (a: T, b: T) => number

export type Transformer<T, U> = (value: T) => U

export type AsyncTransformer<T, U> = (value: T) => Promise<U>
