/**
 * Centralized environment configuration
 */

export interface EnvironmentConfig {
  // App
  appName: string
  appUrl: string
  environment: 'development' | 'staging' | 'production'

  // API
  apiUrl: string
  apiTimeout: number

  // Blockchain
  walletConnectProjectId: string
  gameTokenAddress: string
  gameRewardsAddress: string

  // Features
  enableMultiplayer: boolean
  enableAnalytics: boolean
  enableDebug: boolean
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV ?? 'development'

  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Jump Game',
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    environment:
      nodeEnv === 'production' ? 'production' : nodeEnv === 'staging' ? 'staging' : 'development',

    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
    apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '30000'),

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    gameTokenAddress: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS ?? '',
    gameRewardsAddress: process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS ?? '',

    enableMultiplayer: process.env.NEXT_PUBLIC_ENABLE_MULTIPLAYER !== 'false',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebug: nodeEnv === 'development',
  }
}

/**
 * env utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of env.
 */
export const env = getEnvironmentConfig()
