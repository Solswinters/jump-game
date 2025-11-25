/**
 * Application-wide constants
 */

/**
 * APP_NAME utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of APP_NAME.
 */
export const APP_NAME = 'Jump Game'
/**
 * APP_VERSION utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of APP_VERSION.
 */
export const APP_VERSION = '1.0.0'
/**
 * APP_DESCRIPTION utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of APP_DESCRIPTION.
 */
export const APP_DESCRIPTION = 'Onchain Rewards on Base'

/**
 * ROUTES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ROUTES.
 */
export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  LEADERBOARD: '/leaderboard',
  STATS: '/stats',
} as const

/**
 * BREAKPOINTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of BREAKPOINTS.
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
