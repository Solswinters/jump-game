import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type ChainId = number
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type TransactionType = 'claim' | 'stake' | 'unstake' | 'approve' | 'transfer'
export type TransactionStatus = 'pending' | 'success' | 'failed'

export const CONNECTION_STATUSES: ReadonlyArray<ConnectionStatus> = [
  'disconnected',
  'connecting',
  'connected',
  'error',
] as const

interface PlayerStats {
  gamesPlayed: number
  totalWins: number
  highestScore: number
  totalClaimed: string
  lastClaimTime: number
}

export interface Transaction {
  hash: string
  type: TransactionType
  status: TransactionStatus
  timestamp: number
  amount?: string
  from?: string
  to?: string
  error?: string
  blockNumber?: number
  gasUsed?: string
}

interface WalletStoreState {
  // Connection Status
  address: string | null
  chainId: ChainId | null
  status: ConnectionStatus
  isConnecting: boolean
  error: string | null
  connectedAt: number | null
  lastActivity: number | null

  // Balances
  tokenBalance: string
  nativeBalance: string
  stakedBalance: string
  balancesLastUpdated: number | null

  // Player Data
  playerStats: PlayerStats | null
  canClaim: boolean
  nextClaimTime: number
  pendingRewards: string

  // Transactions
  transactions: Transaction[]
  pendingTxCount: number
  lastTxHash: string | null

  // Actions
  setAddress: (address: string | null) => void
  setChainId: (chainId: ChainId | null) => void
  setStatus: (status: ConnectionStatus) => void
  setError: (error: string | null) => void
  setTokenBalance: (balance: string) => void
  setNativeBalance: (balance: string) => void
  setStakedBalance: (balance: string) => void
  updateBalances: (balances: { token?: string; native?: string; staked?: string }) => void
  setPlayerStats: (stats: PlayerStats | null) => void
  setCanClaim: (canClaim: boolean) => void
  setNextClaimTime: (time: number) => void
  setPendingRewards: (rewards: string) => void
  addTransaction: (tx: Transaction) => void
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void
  removeTransaction: (hash: string) => void
  clearTransactions: () => void
  clearOldTransactions: (maxAge: number) => void
  getTransaction: (hash: string) => Transaction | undefined
  disconnect: () => void
  reset: () => void
  updateActivity: () => void
}

const initialState = {
  address: null,
  chainId: null,
  status: 'disconnected' as ConnectionStatus,
  isConnecting: false,
  error: null,
  connectedAt: null,
  lastActivity: null,
  tokenBalance: '0',
  nativeBalance: '0',
  stakedBalance: '0',
  balancesLastUpdated: null,
  playerStats: null,
  canClaim: false,
  nextClaimTime: 0,
  pendingRewards: '0',
  transactions: [],
  pendingTxCount: 0,
  lastTxHash: null,
}

export const useWalletStore = create<WalletStoreState>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setAddress: (address) =>
        set((state) => {
          state.address = address
          state.status = address ? 'connected' : 'disconnected'
          if (address) {
            state.connectedAt = Date.now()
            state.lastActivity = Date.now()
          }
        }),

      setChainId: (chainId) =>
        set((state) => {
          state.chainId = chainId
          state.lastActivity = Date.now()
        }),

      setStatus: (status) =>
        set((state) => {
          state.status = status
          state.isConnecting = status === 'connecting'
          if (status === 'connected') {
            state.lastActivity = Date.now()
          }
        }),

      setError: (error) =>
        set((state) => {
          state.error = error
          if (error) {
            state.status = 'error'
          }
        }),

      setTokenBalance: (balance) =>
        set((state) => {
          state.tokenBalance = balance
          state.balancesLastUpdated = Date.now()
        }),

      setNativeBalance: (balance) =>
        set((state) => {
          state.nativeBalance = balance
          state.balancesLastUpdated = Date.now()
        }),

      setStakedBalance: (balance) =>
        set((state) => {
          state.stakedBalance = balance
          state.balancesLastUpdated = Date.now()
        }),

      updateBalances: (balances) =>
        set((state) => {
          if (balances.token !== undefined) {
            state.tokenBalance = balances.token
          }
          if (balances.native !== undefined) {
            state.nativeBalance = balances.native
          }
          if (balances.staked !== undefined) {
            state.stakedBalance = balances.staked
          }
          state.balancesLastUpdated = Date.now()
        }),

      setPlayerStats: (stats) => set({ playerStats: stats }),

      setCanClaim: (canClaim) => set({ canClaim }),

      setNextClaimTime: (time) => set({ nextClaimTime: time }),

      setPendingRewards: (rewards) => set({ pendingRewards: rewards }),

      addTransaction: (tx) =>
        set((state) => {
          state.transactions.unshift(tx)
          state.lastTxHash = tx.hash
          if (tx.status === 'pending') {
            state.pendingTxCount += 1
          }
          state.lastActivity = Date.now()
          // Keep only last 50 transactions
          if (state.transactions.length > 50) {
            state.transactions = state.transactions.slice(0, 50)
          }
        }),

      updateTransaction: (hash, updates) =>
        set((state) => {
          const tx = state.transactions.find((t) => t.hash === hash)
          if (tx) {
            const wasPending = tx.status === 'pending'
            Object.assign(tx, updates)
            if (wasPending && updates.status && updates.status !== 'pending') {
              state.pendingTxCount = Math.max(0, state.pendingTxCount - 1)
            }
            state.lastActivity = Date.now()
          }
        }),

      removeTransaction: (hash) =>
        set((state) => {
          const index = state.transactions.findIndex((t) => t.hash === hash)
          if (index !== -1) {
            const tx = state.transactions[index]
            if (tx.status === 'pending') {
              state.pendingTxCount = Math.max(0, state.pendingTxCount - 1)
            }
            state.transactions.splice(index, 1)
          }
        }),

      clearTransactions: () =>
        set((state) => {
          state.transactions = []
          state.pendingTxCount = 0
          state.lastTxHash = null
        }),

      clearOldTransactions: (maxAge) =>
        set((state) => {
          const cutoff = Date.now() - maxAge
          const filtered = state.transactions.filter((tx) => tx.timestamp >= cutoff)
          const removed = state.transactions.length - filtered.length

          state.transactions = filtered
          // Recalculate pending count
          state.pendingTxCount = filtered.filter((tx) => tx.status === 'pending').length

          if (removed > 0 && state.transactions.length === 0) {
            state.lastTxHash = null
          }
        }),

      getTransaction: (hash) => {
        const state = useWalletStore.getState()
        return state.transactions.find((t) => t.hash === hash)
      },

      disconnect: () =>
        set((state) => {
          state.address = null
          state.status = 'disconnected'
          state.error = null
          state.connectedAt = null
          state.tokenBalance = '0'
          state.nativeBalance = '0'
          state.stakedBalance = '0'
          state.balancesLastUpdated = null
          state.playerStats = null
          state.canClaim = false
          state.nextClaimTime = 0
          state.pendingRewards = '0'
        }),

      reset: () => set(initialState),

      updateActivity: () =>
        set((state) => {
          state.lastActivity = Date.now()
        }),
    })),
    { name: 'WalletStore' }
  )
)
