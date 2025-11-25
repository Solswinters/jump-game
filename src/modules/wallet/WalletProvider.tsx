/**
 * Wallet Provider - Modular wallet integration with provider pattern
 * HIGH PRIORITY: Architecture improvements for wallet management
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  balance: string | null
  error: Error | null
}

export interface WalletContextValue extends WalletState {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchNetwork: (chainId: number) => Promise<void>
  signMessage: (message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export interface WalletProviderProps {
  children: ReactNode
  autoConnect?: boolean
  supportedChains?: number[]
  defaultChainId?: number
}

/**
 * WalletProvider utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WalletProvider.
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  autoConnect = false,
  supportedChains = [1, 137, 8453], // Ethereum, Polygon, Base
  defaultChainId = 8453, // Base
}) => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: null,
    error: null,
  })

  useEffect(() => {
    if (autoConnect) {
      checkConnection()
    }

    // Setup event listeners
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        await handleConnect(accounts[0])
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      handleConnect(accounts[0])
    }
  }

  const handleChainChanged = (chainId: string) => {
    setState((prev) => ({
      ...prev,
      chainId: parseInt(chainId, 16),
    }))
  }

  const handleDisconnect = () => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: null,
      error: null,
    })
  }

  const handleConnect = async (address: string) => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })

      setState({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: parseInt(chainId, 16),
        balance: parseInt(balance, 16).toString(),
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error as Error,
      }))
    }
  }

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: new Error('No wallet provider found'),
      }))
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      await handleConnect(accounts[0])
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error as Error,
      }))
    }
  }

  const disconnect = async () => {
    handleDisconnect()
  }

  const switchNetwork = async (chainId: number) => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet provider found')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      // Chain not added yet
      if (error.code === 4902) {
        throw new Error('Network not configured in wallet')
      }
      throw error
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    if (typeof window === 'undefined' || !window.ethereum || !state.address) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      })

      return signature
    } catch (error) {
      throw new Error('Failed to sign message')
    }
  }

  const value: WalletContextValue = {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

/**
 * useWallet utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useWallet.
 */
export const useWallet = (): WalletContextValue => {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }

  return context
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

export default WalletProvider
