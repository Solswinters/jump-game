// Utility type definitions

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Immutable<T> = {
  +readonly [P in keyof T]: T[P]
}

export type PromiseType<T> = T extends Promise<infer U> ? U : T

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

// Array utilities
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never
export type NonEmptyArray<T> = [T, ...T[]]
export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]]

// Object utilities
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>
}

// Function utilities
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never

export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never

export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : never

// Conditional types
export type If<C extends boolean, T, F> = C extends true ? T : F

export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

// String utilities
export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

export type Join<T extends string[], D extends string> = T extends [infer F, ...infer R]
  ? R extends string[]
    ? F extends string
      ? `${F}${D}${Join<R, D>}`
      : never
    : F
  : ''

// Recursive types
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

