/**
 * Responsive design utilities
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'sm'
}

/**
 * Check if current width matches breakpoint
 */
export function matchesBreakpoint(width: number, breakpoint: Breakpoint): boolean {
  return width >= breakpoints[breakpoint]
}

/**
 * Responsive value helper
 */
export function getResponsiveValue<T>(
  width: number,
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T {
  const breakpoint = getCurrentBreakpoint(width)
  return values[breakpoint] ?? values.default
}

/**
 * Mobile-first media query helpers
 */
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
} as const

/**
 * Orientation queries
 */
export const orientationQueries = {
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
} as const

/**
 * Device type queries
 */
export const deviceQueries = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
} as const

/**
 * Container queries (CSS Container Queries)
 */
export const containerQueries = {
  xs: '@container (min-width: 20rem)',
  sm: '@container (min-width: 24rem)',
  md: '@container (min-width: 28rem)',
  lg: '@container (min-width: 32rem)',
  xl: '@container (min-width: 36rem)',
  '2xl': '@container (min-width: 42rem)',
} as const
