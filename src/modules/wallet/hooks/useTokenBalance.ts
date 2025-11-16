/**
 * Hook for fetching token balance
 */

import { useState, useEffect } from 'react'
import { type Address } from 'viem'
import { useReadContract } from 'wagmi'
import { getContractABI } from '@/config/contracts'

export interface UseTokenBalanceResult {
  balance: bigint | null
  formattedBalance: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<unknown>
}

export function useTokenBalance(
  tokenAddress: Address | undefined,
  ownerAddress: Address | undefined
): UseTokenBalanceResult {
  const [formattedBalance, setFormattedBalance] = useState<string | null>(null)

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: tokenAddress,
    abi: getContractABI('gameToken'),
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: Boolean(tokenAddress && ownerAddress),
    },
  })

  useEffect(() => {
    if (balance !== undefined) {
      // Format balance (assuming 18 decimals)
      const formatted = (Number(balance) / 1e18).toFixed(2)
      setFormattedBalance(formatted)
    }
  }, [balance])

  return {
    balance: (balance as bigint | null) ?? null,
    formattedBalance,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
