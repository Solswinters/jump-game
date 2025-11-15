/**
 * Wallet and blockchain type definitions
 */

import type { Hash, Address } from 'viem'

export interface WalletState {
  address: Address | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  balance: bigint | null
}

export interface TokenBalance {
  symbol: string
  name: string
  decimals: number
  balance: bigint
  formattedBalance: string
  usdValue?: number
}

export interface Transaction {
  hash: Hash
  from: Address
  to: Address
  value: bigint
  blockNumber: number
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  type: 'send' | 'receive' | 'contract'
}

export interface ClaimData {
  playerAddress: Address
  score: number
  isWinner: boolean
  nonce: number
  signature: Hash
  timestamp: number
}

export interface RewardInfo {
  baseReward: bigint
  scoreBonus: bigint
  winnerBonus: bigint
  totalReward: bigint
  formattedAmount: string
}

export interface ContractConfig {
  address: Address
  abi: readonly unknown[]
  chainId: number
}

export interface PlayerStats {
  totalClaimed: bigint
  gamesPlayed: number
  highestScore: number
  lastClaimTime: number
  canClaimAt: number
}

export type WalletError =
  | 'USER_REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'NETWORK_ERROR'
  | 'CONTRACT_ERROR'
  | 'UNKNOWN_ERROR'

export interface WalletErrorDetails {
  type: WalletError
  message: string
  originalError?: Error
}
