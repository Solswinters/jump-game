/**
 * Hook to add tokens to user's wallet
 */

import { useWatchAsset as useWagmiWatchAsset } from 'wagmi'
import { type Address } from 'viem'

export interface WatchAssetParams {
  address: Address
  symbol: string
  decimals?: number
  image?: string
}

/**
 * useWatchAsset utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useWatchAsset.
 */
export function useWatchAsset() {
  const { watchAsset, isPending, isSuccess, error } = useWagmiWatchAsset()

  const addToken = async ({ address, symbol, decimals = 18, image }: WatchAssetParams) => {
    try {
      await watchAsset({
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      })
      return true
    } catch (err) {
      console.error('Failed to add token to wallet', err)
      return false
    }
  }

  return {
    addToken,
    isPending,
    isSuccess,
    error,
  }
}
