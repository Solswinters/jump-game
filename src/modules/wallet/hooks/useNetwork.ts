/**
 * Hook for network information
 */

import { useAccount, useChainId, useChains } from 'wagmi'

/**
 * useNetwork utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useNetwork.
 */
export function useNetwork() {
  const { chain } = useAccount()
  const chainId = useChainId()
  const chains = useChains()

  return {
    chain,
    chainId,
    chains,
    isSupported: chain ? !chain.unsupported : true,
    name: chain?.name,
    nativeCurrency: chain?.nativeCurrency,
    blockExplorer: chain?.blockExplorers?.default,
  }
}
