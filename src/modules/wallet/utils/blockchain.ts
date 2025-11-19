/**
 * Blockchain utility functions
 */

import { formatUnits, parseUnits, type Address } from 'viem'

export function formatTokenAmount(amount: bigint, decimals = 18): string {
  return formatUnits(amount, decimals)
}

export function parseTokenAmount(amount: string, decimals = 18): bigint {
  return parseUnits(amount, decimals)
}

export function formatAddress(address: Address, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function compareAddresses(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

export function formatGwei(wei: bigint): string {
  return formatUnits(wei, 9)
}

export function formatEther(wei: bigint): string {
  return formatUnits(wei, 18)
}

export function parseEther(ether: string): bigint {
  return parseUnits(ether, 18)
}

export function calculatePercentage(part: bigint, total: bigint): number {
  if (total === 0n) return 0
  return Number((part * 10000n) / total) / 100
}

export function mulDiv(a: bigint, b: bigint, c: bigint): bigint {
  return (a * b) / c
}

export function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function clamp(value: bigint, minValue: bigint, maxValue: bigint): bigint {
  return max(minValue, min(maxValue, value))
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

export function getBlockExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    84532: 'https://sepolia.basescan.org',
    8453: 'https://basescan.org',
  }

  const baseUrl = explorers[chainId] ?? 'https://etherscan.io'
  return `${baseUrl}/tx/${txHash}`
}

export function getAddressExplorerUrl(chainId: number, address: Address): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    84532: 'https://sepolia.basescan.org',
    8453: 'https://basescan.org',
  }

  const baseUrl = explorers[chainId] ?? 'https://etherscan.io'
  return `${baseUrl}/address/${address}`
}
