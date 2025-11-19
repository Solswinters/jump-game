/**
 * Advanced utility types for better type inference and safety
 */

// Make specified keys required
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specified keys optional
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Deep partial - makes all nested properties optional
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

// Deep readonly - makes all nested properties readonly
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
  : T

// Mutable - removes readonly modifier
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// Deep mutable
export type DeepMutable<T> = T extends object
  ? {
      -readonly [P in keyof T]: DeepMutable<T[P]>
    }
  : T

// Non-nullable type (removes null and undefined)
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

// Extract keys of type T that are of type U
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

// Require at least one property from T
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// Require only one property from T
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

// Function type helpers
export type AsyncFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => Promise<TReturn>

export type SyncFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => TReturn

// Extract function parameters
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never

// Extract function return type
export type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

// Extract async function return type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// Array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// Object value types
export type ValueOf<T> = T[keyof T]

// Prettify types for better IDE hints
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & NonNullable<unknown>

// Flatten nested objects
export type Flatten<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T

// Tuple to union
export type TupleToUnion<T extends readonly unknown[]> = T[number]

// Union to intersection
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

// Merge two types
export type Merge<T, U> = Omit<T, keyof U> & U

// Strict Omit - ensures keys exist in T
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Strict Pick - ensures keys exist in T
export type StrictPick<T, K extends keyof T> = Pick<T, K>

// Mutable keys of T
export type MutableKeys<T> = {
  [P in keyof T]-?: (<F>() => F extends { [Q in P]: T[P] } ? 1 : 2) extends <F>() => F extends {
    -readonly [Q in P]: T[P]
  }
    ? 1
    : 2
    ? P
    : never
}[keyof T]

// Readonly keys of T
export type ReadonlyKeys<T> = {
  [P in keyof T]-?: (<F>() => F extends { [Q in P]: T[P] } ? 1 : 2) extends <F>() => F extends {
    -readonly [Q in P]: T[P]
  }
    ? 1
    : 2
    ? never
    : P
}[keyof T]

// Awaited type for promises
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

// Result type for operations that can fail
export type Result<T, E = Error> = Success<T> | Failure<E>

export type Success<T> = {
  success: true
  data: T
  error?: never
}

export type Failure<E> = {
  success: false
  data?: never
  error: E
}

// Option type for nullable values
export type Option<T> = Some<T> | None

export type Some<T> = {
  hasValue: true
  value: T
}

export type None = {
  hasValue: false
  value?: never
}

// Helper to create Result types
export const success = <T>(data: T): Success<T> => ({ success: true, data })
export const failure = <E>(error: E): Failure<E> => ({ success: false, error })

// Helper to create Option types
export const some = <T>(value: T): Some<T> => ({ hasValue: true, value })
export const none = (): None => ({ hasValue: false })
