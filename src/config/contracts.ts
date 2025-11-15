/**
 * Smart contract addresses and ABIs configuration
 */

import { base, baseSepolia } from 'wagmi/chains'
import GameTokenABI from '@/abis/GameToken.json'
import GameRewardsABI from '@/abis/GameRewards.json'

export const CONTRACT_ADDRESSES = {
  [base.id]: {
    gameToken: (process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS ?? '') as `0x${string}`,
    gameRewards: (process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS ?? '') as `0x${string}`,
  },
  [baseSepolia.id]: {
    gameToken: (process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS ?? '') as `0x${string}`,
    gameRewards: (process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS ?? '') as `0x${string}`,
  },
} as const

export const CONTRACT_ABIS = {
  gameToken: GameTokenABI as unknown as readonly unknown[],
  gameRewards: GameRewardsABI as unknown as readonly unknown[],
} as const

export function getContractAddress(
  chainId: number,
  contractName: 'gameToken' | 'gameRewards'
): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses) {
    throw new Error(`Chain ${chainId} not supported`)
  }
  return addresses[contractName]
}

export function getGameTokenAddress(chainId: number): `0x${string}` {
  return getContractAddress(chainId, 'gameToken')
}

export function getGameRewardsAddress(chainId: number): `0x${string}` {
  return getContractAddress(chainId, 'gameRewards')
}

export function getContractABI(contractName: 'gameToken' | 'gameRewards'): readonly unknown[] {
  return CONTRACT_ABIS[contractName]
}

export type ContractName = 'gameToken' | 'gameRewards'
export type ContractAddresses = typeof CONTRACT_ADDRESSES
