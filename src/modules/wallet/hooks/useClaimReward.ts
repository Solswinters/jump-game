/**
 * Hook for claiming rewards
 */

import { useState } from 'react'
import { type Address, type Hash } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getGameRewardsAddress, getContractABI } from '@/config/contracts'

export interface ClaimRewardParams {
  score: number
  isWinner: boolean
  nonce: number
  signature: Hash
}

export interface UseClaimRewardResult {
  claimReward: (params: ClaimRewardParams) => Promise<Hash | undefined>
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
  txHash: Hash | undefined
}

export function useClaimReward(chainId: number): UseClaimRewardResult {
  const [txHash, setTxHash] = useState<Hash | undefined>()

  const { writeContractAsync, isPending, error: writeError } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const claimReward = async (params: ClaimRewardParams): Promise<Hash | undefined> => {
    try {
      const hash = await writeContractAsync({
        address: getGameRewardsAddress(chainId),
        abi: getContractABI('gameRewards'),
        functionName: 'claimReward',
        args: [params.score, params.isWinner, params.nonce, params.signature],
      })

      setTxHash(hash)
      return hash
    } catch (error) {
      console.error('Claim reward error:', error)
      throw error
    }
  }

  return {
    claimReward,
    isPending,
    isConfirming,
    isSuccess,
    error: (writeError ?? confirmError) as Error | null,
    txHash,
  }
}
