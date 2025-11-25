/**
 * Environment configuration
 */

/**
 * env utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of env.
 */
export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Blockchain
  CHAIN_ID: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 8453,
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || '',
  GAME_TOKEN_ADDRESS:
    process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  GAME_REWARDS_ADDRESS:
    process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS || '0x0000000000000000000000000000000000000000',

  // WalletConnect
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

  // API Keys
  ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
  INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY || '',

  // Analytics
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Game
  MAX_SCORE: Number(process.env.NEXT_PUBLIC_MAX_SCORE) || 1000000,
  REWARD_THRESHOLD: Number(process.env.NEXT_PUBLIC_REWARD_THRESHOLD) || 1000,

  // Multiplayer
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost:3001',
  MAX_PLAYERS: Number(process.env.NEXT_PUBLIC_MAX_PLAYERS) || 4,

  // Feature Flags (from process.env)
  ENABLE_MULTIPLAYER: process.env.NEXT_PUBLIC_ENABLE_MULTIPLAYER === 'true',
  ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3 === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const

/**
 * Validate environment variables
 */
export function validateEnv(): void {
  const required = ['WALLETCONNECT_PROJECT_ID', 'RPC_URL']

  const missing = required.filter((key) => {
    const value = env[key as keyof typeof env]
    return !value || value === ''
  })

  if (missing.length > 0 && env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === 'test'

/**
 * Check if running on client
 */
export const isClient = typeof window !== 'undefined'

/**
 * Check if running on server
 */
export const isServer = !isClient
