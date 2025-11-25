/**
 * Wallet formatting utilities
 */

import { TOKEN_DECIMALS } from '../constants'

/**
 * formatAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatAddress.
 */
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) {
    return ''
  }

  if (address.length <= startChars + endChars) {
    return address
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * formatTokenAmount utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatTokenAmount.
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = TOKEN_DECIMALS
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return '0'
  }

  const divisor = Math.pow(10, decimals)
  const formatted = numAmount / divisor

  return formatted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

/**
 * parseTokenAmount utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of parseTokenAmount.
 */
export function parseTokenAmount(amount: string, decimals: number = TOKEN_DECIMALS): bigint {
  try {
    const [whole, fraction = ''] = amount.split('.')
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
    const combined = whole + paddedFraction
    return BigInt(combined)
  } catch {
    return BigInt(0)
  }
}

/**
 * formatTransactionHash utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatTransactionHash.
 */
export function formatTransactionHash(hash: string): string {
  return formatAddress(hash, 10, 8)
}

/**
 * formatChainId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatChainId.
 */
export function formatChainId(chainId: number): string {
  return `0x${chainId.toString(16)}`
}

/**
 * isValidAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidAddress.
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * isValidTransactionHash utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidTransactionHash.
 */
export function isValidTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * formatGasPrice utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatGasPrice.
 */
export function formatGasPrice(gasPrice: bigint): string {
  const gwei = Number(gasPrice) / 1e9
  return `${gwei.toFixed(2)} Gwei`
}
