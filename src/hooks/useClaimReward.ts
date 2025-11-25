/**
 * Hook for claiming game rewards
 */

import { useState } from 'react'
import { type Hex } from 'viem'
import { usePublicClient, useWalletClient, useChainId, useAccount } from 'wagmi'
import { writeContractData } from '@/modules/wallet/utils/contract-helpers'
import { transactionService } from '@/modules/wallet/services/transaction-service'
import { logger } from '@/utils/logger'

interface ClaimRewardState {
  transactionHash: Hex | null
  loading: boolean
  error: Error | null
  success: boolean
}

interface ClaimRewardParams {
  score: number
  isWinner: boolean
  signature: Hex
}

/**
 * useClaimReward utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useClaimReward.
 */
export function useClaimReward() {
  const [state, setState] = useState<ClaimRewardState>({
    transactionHash: null,
    loading: false,
    error: null,
    success: false,
  })

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId()
  const { address } = useAccount()

  const claimReward = async (params: ClaimRewardParams) => {
    if (!address || !publicClient || !walletClient) {
      const error = new Error('Wallet not connected')
      setState((prev) => ({ ...prev, error, loading: false }))
      logger.error('Cannot claim reward: Wallet not connected')
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null, success: false }))

    try {
      const { score, isWinner, signature } = params

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const hash = await writeContractData(
        walletClient,
        publicClient,
        'gameRewards',
        'claimReward',
        [score, isWinner, signature],
        address,
        chainId
      )

      if (!hash) {
        throw new Error('Transaction failed to submit')
      }

      // Track the transaction
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      transactionService.addPendingTransaction({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hash,
        from: address,
        to: undefined, // Contract address is handled internally
        message: 'Claiming game reward',
      })

      setState({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        transactionHash: hash,
        loading: false,
        error: null,
        success: true,
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      logger.info(`Reward claim transaction submitted: ${hash}`)

      // Wait for transaction receipt
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        transactionService.updateTransactionStatus(hash, 'success', 'Reward claimed successfully')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        logger.info(`Reward claim successful: ${hash}`)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        transactionService.updateTransactionStatus(hash, 'failed', 'Transaction reverted')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        logger.error(`Reward claim failed: ${hash}`)
        const revertError = new Error('Transaction reverted')
        setState((prev) => ({
          ...prev,
          error: revertError,
          success: false,
        }))
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      logger.error('Failed to claim reward', error)
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
        success: false,
      }))
    }
  }

  const reset = () => {
    setState({
      transactionHash: null,
      loading: false,
      error: null,
      success: false,
    })
  }

  return { ...state, claimReward, reset }
}
