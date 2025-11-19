/**
 * Blockchain chain configurations
 */

import { base, baseSepolia, mainnet, sepolia } from 'wagmi/chains'
import type { Chain } from 'wagmi/chains'

/**
 * Supported chains
 */
export const supportedChains = [base, baseSepolia, mainnet, sepolia] as const

/**
 * Default chain
 */
export const defaultChain = base

/**
 * Get chain by ID
 */
export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find(chain => chain.id === chainId)
}

/**
 * Get chain by name
 */
export function getChainByName(name: string): Chain | undefined {
  return supportedChains.find(chain => chain.name.toLowerCase() === name.toLowerCase())
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return supportedChains.some(chain => chain.id === chainId)
}

/**
 * Get block explorer URL for address
 */
export function getExplorerAddressUrl(chainId: number, address: string): string | null {
  const chain = getChainById(chainId)
  if (!chain?.blockExplorers?.default) return null

  return `${chain.blockExplorers.default.url}/address/${address}`
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerTxUrl(chainId: number, txHash: string): string | null {
  const chain = getChainById(chainId)
  if (!chain?.blockExplorers?.default) return null

  return `${chain.blockExplorers.default.url}/tx/${txHash}`
}

/**
 * Get block explorer URL for block
 */
export function getExplorerBlockUrl(chainId: number, blockNumber: number | string): string | null {
  const chain = getChainById(chainId)
  if (!chain?.blockExplorers?.default) return null

  return `${chain.blockExplorers.default.url}/block/${blockNumber}`
}

/**
 * Get chain native currency symbol
 */
export function getChainCurrencySymbol(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency?.symbol || 'ETH'
}

/**
 * Get chain name
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name || 'Unknown Chain'
}

/**
 * Chain metadata
 */
export interface ChainMetadata {
  id: number
  name: string
  shortName: string
  symbol: string
  color: string
  logo: string
  testnet: boolean
}

/**
 * Extended chain metadata
 */
export const chainMetadata: Record<number, ChainMetadata> = {
  [mainnet.id]: {
    id: mainnet.id,
    name: 'Ethereum',
    shortName: 'ETH',
    symbol: 'ETH',
    color: '#627EEA',
    logo: '/chains/ethereum.svg',
    testnet: false,
  },
  [base.id]: {
    id: base.id,
    name: 'Base',
    shortName: 'Base',
    symbol: 'ETH',
    color: '#0052FF',
    logo: '/chains/base.svg',
    testnet: false,
  },
  [sepolia.id]: {
    id: sepolia.id,
    name: 'Sepolia',
    shortName: 'SEP',
    symbol: 'ETH',
    color: '#CFB5F0',
    logo: '/chains/ethereum.svg',
    testnet: true,
  },
  [baseSepolia.id]: {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    shortName: 'BaseSep',
    symbol: 'ETH',
    color: '#0052FF',
    logo: '/chains/base.svg',
    testnet: true,
  },
}

/**
 * Get chain metadata
 */
export function getChainMetadata(chainId: number): ChainMetadata | null {
  return chainMetadata[chainId] || null
}
