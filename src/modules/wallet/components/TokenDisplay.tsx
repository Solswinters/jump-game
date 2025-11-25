/**
 * Token balance display component
 */

'use client'

import { type Address } from 'viem'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { formatTokenAmount } from '../utils/blockchain'

export interface TokenDisplayProps {
  tokenAddress: Address
  symbol: string
  decimals?: number
  showFull?: boolean
}

/**
 * TokenDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TokenDisplay.
 */
export function TokenDisplay({
  tokenAddress,
  symbol,
  decimals = 18,
  showFull = false,
}: TokenDisplayProps) {
  const { balance, isLoading, error } = useTokenBalance({ tokenAddress })

  if (isLoading) {
    return <div className="animate-pulse text-gray-400">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error loading balance</div>
  }

  if (!balance) {
    return <div className="text-gray-500">0 {symbol}</div>
  }

  const formatted = formatTokenAmount(balance, decimals)
  const display = showFull ? formatted : parseFloat(formatted).toFixed(2)

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-white">{display}</span>
      <span className="text-sm text-gray-400">{symbol}</span>
    </div>
  )
}
