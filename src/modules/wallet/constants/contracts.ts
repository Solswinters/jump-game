/**
 * Contract addresses and configurations
 */

import { type Address } from 'viem'

export interface ContractConfig {
  address: Address
  chainId: number
  deployBlock?: number
}

/**
 * Game Token contracts by chain
 */
export const GAME_TOKEN_CONTRACTS: Record<number, ContractConfig> = {
  8453: {
    address: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual address
    chainId: 8453,
    deployBlock: 0,
  },
  84532: {
    address: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual address
    chainId: 84532,
    deployBlock: 0,
  },
}

/**
 * Game Rewards contracts by chain
 */
export const GAME_REWARDS_CONTRACTS: Record<number, ContractConfig> = {
  8453: {
    address: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual address
    chainId: 8453,
    deployBlock: 0,
  },
  84532: {
    address: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual address
    chainId: 84532,
    deployBlock: 0,
  },
}

/**
 * NFT contracts by chain
 */
export const NFT_CONTRACTS: Record<number, ContractConfig> = {
  8453: {
    address: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual address
    chainId: 8453,
    deployBlock: 0,
  },
}

/**
 * Multicall contracts by chain
 */
export const MULTICALL_CONTRACTS: Record<number, Address> = {
  1: '0xcA11bde05977b3631167028862bE2a173976CA11',
  8453: '0xcA11bde05977b3631167028862bE2a173976CA11',
  137: '0xcA11bde05977b3631167028862bE2a173976CA11',
  42161: '0xcA11bde05977b3631167028862bE2a173976CA11',
  10: '0xcA11bde05977b3631167028862bE2a173976CA11',
}

/**
 * Get game token contract for chain
 */
export function getGameTokenContract(chainId: number): ContractConfig | undefined {
  return GAME_TOKEN_CONTRACTS[chainId]
}

/**
 * Get game rewards contract for chain
 */
export function getGameRewardsContract(chainId: number): ContractConfig | undefined {
  return GAME_REWARDS_CONTRACTS[chainId]
}

/**
 * Get NFT contract for chain
 */
export function getNFTContract(chainId: number): ContractConfig | undefined {
  return NFT_CONTRACTS[chainId]
}

/**
 * Get multicall contract for chain
 */
export function getMulticallContract(chainId: number): Address | undefined {
  return MULTICALL_CONTRACTS[chainId]
}

/**
 * Check if game contracts are deployed on chain
 */
export function hasGameContracts(chainId: number): boolean {
  return !!GAME_TOKEN_CONTRACTS[chainId] && !!GAME_REWARDS_CONTRACTS[chainId]
}
