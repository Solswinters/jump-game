/**
 * Blockchain-related types
 */

import { type Address } from 'viem'

export interface TokenInfo {
  address: Address
  name: string
  symbol: string
  decimals: number
  logo?: string
}

export interface TokenBalance {
  token: TokenInfo
  balance: bigint
  formattedBalance: string
  valueUSD?: number
}

export interface Transaction {
  hash: string
  from: Address
  to: Address | null
  value: bigint
  timestamp: number
  blockNumber: number
  status: 'pending' | 'success' | 'failed'
  gasUsed?: bigint
  gasPrice?: bigint
}

export interface RewardClaim {
  id: string
  player: Address
  amount: bigint
  score: number
  timestamp: number
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface PlayerOnChainStats {
  address: Address
  totalGames: number
  totalScore: number
  highScore: number
  totalRewards: bigint
  lastPlayed: number
}

export interface GasEstimate {
  gasLimit: bigint
  gasPrice: bigint
  totalCost: bigint
  totalCostFormatted: string
}

export interface ChainInfo {
  chainId: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error'

export interface TransactionState {
  status: TransactionStatus
  hash?: string
  error?: Error
}
