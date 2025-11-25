/**
 * Comprehensive wallet modal component
 */

'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { formatAddress } from '../utils/blockchain'
import { Modal } from '@/shared/components/Modal'

/**
 * WalletModal utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WalletModal.
 */
export function WalletModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
      >
        {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Wallet">
        <div className="space-y-4">
          {isConnected && address ? (
            <>
              <div className="rounded-lg bg-gray-800 p-4">
                <p className="text-sm text-gray-400">Connected Address</p>
                <p className="font-mono text-white">{address}</p>
              </div>

              {chain && (
                <div className="rounded-lg bg-gray-800 p-4">
                  <p className="text-sm text-gray-400">Network</p>
                  <p className="text-white">{chain.name}</p>
                </div>
              )}

              <button
                onClick={handleDisconnect}
                className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Disconnect
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-400">Choose a wallet to connect:</p>
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector })
                    setIsOpen(false)
                  }}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-left transition-colors hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="font-semibold text-white">{connector.name}</span>
                  {isPending && <span className="text-sm text-gray-400">Connecting...</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
