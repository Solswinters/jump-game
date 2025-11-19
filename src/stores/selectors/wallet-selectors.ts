import { useWalletStore } from '../wallet-store'

// Basic selectors
export const useWalletAddress = () => useWalletStore(state => state.address)
export const useChainId = () => useWalletStore(state => state.chainId)
export const useConnectionStatus = () => useWalletStore(state => state.status)
export const useIsConnected = () => useWalletStore(state => state.address !== null)
export const useIsConnecting = () => useWalletStore(state => state.isConnecting)
export const useWalletError = () => useWalletStore(state => state.error)

// Balance selectors
export const useTokenBalance = () => useWalletStore(state => state.tokenBalance)
export const useNativeBalance = () => useWalletStore(state => state.nativeBalance)
export const useStakedBalance = () => useWalletStore(state => state.stakedBalance)

// Player stats selectors
export const usePlayerStats = () => useWalletStore(state => state.playerStats)
export const useCanClaim = () => useWalletStore(state => state.canClaim)
export const useNextClaimTime = () => useWalletStore(state => state.nextClaimTime)
export const usePendingRewards = () => useWalletStore(state => state.pendingRewards)

// Transaction selectors
export const useTransactions = () => useWalletStore(state => state.transactions)
export const usePendingTransactions = () =>
  useWalletStore(state => state.transactions.filter(tx => tx.status === 'pending'))
export const usePendingTxCount = () => useWalletStore(state => state.pendingTxCount)

// Combined selectors
export const useWalletBalances = () =>
  useWalletStore(state => ({
    token: state.tokenBalance,
    native: state.nativeBalance,
    staked: state.stakedBalance,
  }))

export const useClaimStatus = () =>
  useWalletStore(state => ({
    canClaim: state.canClaim,
    nextClaimTime: state.nextClaimTime,
    pendingRewards: state.pendingRewards,
  }))

export const useWalletInfo = () =>
  useWalletStore(state => ({
    address: state.address,
    chainId: state.chainId,
    status: state.status,
    isConnected: state.address !== null,
    error: state.error,
  }))
