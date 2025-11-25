/**
 * Transaction history store
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Transaction } from '../types/blockchain'

interface TransactionsState {
  transactions: Transaction[]
  isLoading: boolean
  error: Error | null
}

interface TransactionsActions {
  addTransaction: (tx: Transaction) => void
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void
  setTransactions: (transactions: Transaction[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  clearTransactions: () => void
  getTransaction: (hash: string) => Transaction | undefined
  getPendingTransactions: () => Transaction[]
}

type TransactionsStore = TransactionsState & TransactionsActions

const initialState: TransactionsState = {
  transactions: [],
  isLoading: false,
  error: null,
}

/**
 * useTransactionsStore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useTransactionsStore.
 */
export const useTransactionsStore = create<TransactionsStore>()(
  immer((set, get) => ({
    ...initialState,

    addTransaction: (tx) => {
      set((state) => {
        // Add to beginning for reverse chronological order
        state.transactions.unshift(tx)
      })
    },

    updateTransaction: (hash, updates) => {
      set((state) => {
        const tx = state.transactions.find((t) => t.hash === hash)
        if (tx) {
          Object.assign(tx, updates)
        }
      })
    },

    setTransactions: (transactions) => {
      set((state) => {
        state.transactions = transactions
      })
    },

    setLoading: (isLoading) => {
      set((state) => {
        state.isLoading = isLoading
      })
    },

    setError: (error) => {
      set((state) => {
        state.error = error
      })
    },

    clearTransactions: () => {
      set((state) => {
        state.transactions = []
      })
    },

    getTransaction: (hash) => {
      return get().transactions.find((tx) => tx.hash === hash)
    },

    getPendingTransactions: () => {
      return get().transactions.filter((tx) => tx.status === 'pending')
    },
  }))
)
