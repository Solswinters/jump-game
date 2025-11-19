import { useWalletStore } from '@/stores/wallet-store'
import { act } from '@testing-library/react'

describe('Wallet Flow Integration', () => {
  beforeEach(() => {
    act(() => {
      useWalletStore.setState(
        {
          address: null,
          isConnected: false,
          chainId: null,
          balance: '0',
        },
        true
      )
    })
  })

  it('should handle wallet connection flow', () => {
    act(() => {
      useWalletStore.getState().setAddress('0x1234567890abcdef')
      useWalletStore.getState().setIsConnected(true)
      useWalletStore.getState().setChainId(8453)
    })

    const state = useWalletStore.getState()
    expect(state.isConnected).toBe(true)
    expect(state.address).toBe('0x1234567890abcdef')
    expect(state.chainId).toBe(8453)
  })

  it('should handle chain switching', () => {
    act(() => {
      useWalletStore.getState().setChainId(1)
    })
    expect(useWalletStore.getState().chainId).toBe(1)

    act(() => {
      useWalletStore.getState().setChainId(8453)
    })
    expect(useWalletStore.getState().chainId).toBe(8453)
  })

  it('should handle balance updates', () => {
    act(() => {
      useWalletStore.getState().setBalance('1000000000000000000')
    })
    expect(useWalletStore.getState().balance).toBe('1000000000000000000')
  })
})
