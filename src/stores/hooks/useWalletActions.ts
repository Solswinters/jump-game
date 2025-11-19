import { useCallback } from 'react'
import { useWalletStore } from '../wallet-store'

interface Transaction {
  hash: string
  type: 'claim' | 'stake' | 'unstake' | 'approve'
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  amount?: string
}

export function useWalletActions() {
  const store = useWalletStore()

  const connect = useCallback(
    (address: string, chainId: number) => {
      store.setAddress(address)
      store.setChainId(chainId)
      store.setStatus('connected')
      store.setError(null)
    },
    [store]
  )

  const disconnect = useCallback(() => {
    store.disconnect()
  }, [store])

  const switchChain = useCallback(
    (chainId: number) => {
      store.setChainId(chainId)
    },
    [store]
  )

  const updateBalance = useCallback(
    (token: string, native: string, staked?: string) => {
      store.setTokenBalance(token)
      store.setNativeBalance(native)
      if (staked !== undefined) {
        store.setStakedBalance(staked)
      }
    },
    [store]
  )

  const setError = useCallback(
    (error: string | null) => {
      store.setError(error)
    },
    [store]
  )

  const addTransaction = useCallback(
    (tx: Transaction) => {
      store.addTransaction(tx)
    },
    [store]
  )

  const updateTransactionStatus = useCallback(
    (hash: string, status: Transaction['status']) => {
      store.updateTransaction(hash, { status })
    },
    [store]
  )

  const markTransactionSuccess = useCallback(
    (hash: string) => {
      store.updateTransaction(hash, { status: 'success' })
    },
    [store]
  )

  const markTransactionFailed = useCallback(
    (hash: string) => {
      store.updateTransaction(hash, { status: 'failed' })
    },
    [store]
  )

  return {
    connect,
    disconnect,
    switchChain,
    updateBalance,
    setError,
    addTransaction,
    updateTransactionStatus,
    markTransactionSuccess,
    markTransactionFailed,
  }
}
