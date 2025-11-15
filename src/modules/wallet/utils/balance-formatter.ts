/**
 * Balance formatting utilities for wallet
 */

import { formatUnits, parseUnits } from 'viem'

export function formatTokenBalance(balance: bigint, decimals: number = 18): string {
  return formatUnits(balance, decimals)
}

export function formatTokenBalanceShort(balance: bigint, decimals: number = 18): string {
  const formatted = formatUnits(balance, decimals)
  const number = parseFloat(formatted)

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(2)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(2)}K`
  }
  if (number >= 1) {
    return number.toFixed(2)
  }
  return number.toFixed(4)
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  return parseUnits(amount, decimals)
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateUSDValue(balance: bigint, price: number, decimals: number = 18): number {
  const balanceNumber = parseFloat(formatUnits(balance, decimals))
  return balanceNumber * price
}

export function formatBalanceWithSymbol(
  balance: bigint,
  symbol: string,
  decimals: number = 18
): string {
  const formatted = formatTokenBalanceShort(balance, decimals)
  return `${formatted} ${symbol}`
}
