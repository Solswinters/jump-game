/**
 * Blockchain chain helper utilities
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/only-throw-error */

import { SUPPORTED_CHAINS, getChainById, getChainName, isChainSupported } from '@/config/chains'
import { logger } from '@/utils/logger'

export function formatChainId(chainId: number): string {
  return `0x${chainId.toString(16)}`
}

export function parseChainId(chainIdHex: string): number {
  return parseInt(chainIdHex, 16)
}

export function isTestnet(chainId: number): boolean {
  const chain = getChainById(chainId)
  if (!chain) {return false}
  return chain.testnet ?? false
}

export function getBlockExplorerUrl(
  chainId: number,
  hash: string,
  type: 'tx' | 'address' | 'block' = 'tx'
): string | null {
  const chain = getChainById(chainId)
  if (!chain?.blockExplorers?.default) {return null}

  const baseUrl = chain.blockExplorers.default.url
  const paths = {
    tx: `/tx/${hash}`,
    address: `/address/${hash}`,
    block: `/block/${hash}`,
  }

  return `${baseUrl}${paths[type]}`
}

export function getNativeCurrencySymbol(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency?.symbol ?? 'ETH'
}

export function getNativeCurrencyDecimals(chainId: number): number {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency?.decimals ?? 18
}

export function getAllSupportedChainIds(): number[] {
  return SUPPORTED_CHAINS.map(chain => chain.id)
}

export function switchToChain(chainId: number): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return Promise.reject(new Error('Ethereum provider not found'))
  }

  return window.ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formatChainId(chainId) }],
    })
    .then(() => {
      logger.info(`Switched to chain ${getChainName(chainId)}`)
    })
    .catch((error: { code: number }) => {
      // Chain not added to wallet
      if (error.code === 4902) {
        return addChainToWallet(chainId)
      }
      throw error
    })
}

export async function addChainToWallet(chainId: number): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not found')
  }

  const chain = getChainById(chainId)
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  const params = {
    chainId: formatChainId(chainId),
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpcUrls.default.http,
    blockExplorerUrls: chain.blockExplorers?.default
      ? [chain.blockExplorers.default.url]
      : undefined,
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [params],
  })

  logger.info(`Added chain ${chain.name} to wallet`)
}

export { SUPPORTED_CHAINS, getChainById, getChainName, isChainSupported }

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/only-throw-error */
