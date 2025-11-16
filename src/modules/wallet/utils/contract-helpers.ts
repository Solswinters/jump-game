/**
 * Smart contract helper utilities
 */

import { type Address, type Hash } from 'viem'

export function isContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function formatContractError(error: Error): string {
  const message = error.message

  // Common contract errors
  if (message.includes('user rejected')) {
    return 'Transaction was rejected'
  }
  if (message.includes('insufficient funds')) {
    return 'Insufficient funds for gas'
  }
  if (message.includes('gas required exceeds allowance')) {
    return 'Gas limit too low'
  }
  if (message.includes('nonce too low')) {
    return 'Transaction nonce error'
  }
  if (message.includes('already known')) {
    return 'Transaction already submitted'
  }

  return message
}

export interface ContractCall {
  address: Address
  abi: readonly unknown[]
  functionName: string
  args?: readonly unknown[]
}

export function createContractCall(
  address: Address,
  abi: readonly unknown[],
  functionName: string,
  args?: readonly unknown[]
): ContractCall {
  return {
    address,
    abi,
    functionName,
    args,
  }
}

export function encodeErrorReason(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}

export function isTransactionHash(hash: string): hash is Hash {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export function shortenTransactionHash(hash: Hash): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export interface TransactionReceipt {
  hash: Hash
  blockNumber: bigint
  status: 'success' | 'reverted'
  gasUsed: bigint
}

export function parseTransactionStatus(status: number | bigint): 'success' | 'reverted' {
  const statusNum = typeof status === 'bigint' ? Number(status) : status
  return statusNum === 1 ? 'success' : 'reverted'
}

export function calculateEstimatedWaitTime(gasPrice: bigint): number {
  // Estimate wait time in seconds based on gas price
  const gwei = Number(gasPrice) / 1e9

  if (gwei < 10) {
    return 300
  } // 5 minutes
  if (gwei < 30) {
    return 120
  } // 2 minutes
  if (gwei < 50) {
    return 60
  } // 1 minute
  return 30 // 30 seconds
}
