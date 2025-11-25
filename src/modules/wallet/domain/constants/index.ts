/**
 * Wallet and contract constants
 */

/**
 * WALLET_CONSTANTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WALLET_CONSTANTS.
 */
export const WALLET_CONSTANTS = {
  // Contract addresses (overridden by env vars)
  DEFAULT_GAME_TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000' as const,
  DEFAULT_GAME_REWARDS_ADDRESS: '0x0000000000000000000000000000000000000000' as const,

  // Transaction
  DEFAULT_GAS_LIMIT: 200000n,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000,

  // Claim
  DEFAULT_COOLDOWN_PERIOD: 3600, // 1 hour in seconds
  MIN_CLAIM_SCORE: 100,
  MAX_CLAIM_SCORE: 1000000,

  // Wallet connect
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
} as const

/**
 * CONTRACT_ADDRESSES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CONTRACT_ADDRESSES.
 */
export const CONTRACT_ADDRESSES = {
  GAME_TOKEN: (process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS ??
    WALLET_CONSTANTS.DEFAULT_GAME_TOKEN_ADDRESS) as `0x${string}`,
  GAME_REWARDS: (process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS ??
    WALLET_CONSTANTS.DEFAULT_GAME_REWARDS_ADDRESS) as `0x${string}`,
} as const
