/**
 * Hook for ENS resolution
 */

import { useEnsAddress, useEnsName, useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { type Address } from 'viem'

/**
 * useENSAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useENSAddress.
 */
export function useENSAddress(name: string | undefined) {
  const normalized = name ? normalize(name) : undefined

  const {
    data: address,
    isLoading,
    error,
  } = useEnsAddress({
    name: normalized,
    query: {
      enabled: !!normalized,
    },
  })

  return {
    address,
    isLoading,
    error,
  }
}

/**
 * useENSName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useENSName.
 */
export function useENSName(address: Address | undefined) {
  const {
    data: name,
    isLoading,
    error,
  } = useEnsName({
    address,
    query: {
      enabled: !!address,
    },
  })

  return {
    name,
    isLoading,
    error,
  }
}

/**
 * useENSAvatar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useENSAvatar.
 */
export function useENSAvatar(name: string | undefined) {
  const normalized = name ? normalize(name) : undefined

  const {
    data: avatar,
    isLoading,
    error,
  } = useEnsAvatar({
    name: normalized,
    query: {
      enabled: !!normalized,
    },
  })

  return {
    avatar,
    isLoading,
    error,
  }
}
