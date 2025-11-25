/**
 * Token swap widget component
 */

'use client'

import { useState } from 'react'
import { type Address } from 'viem'
import { Card } from '@/shared/components/Card'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { ApprovalButton } from './ApprovalButton'
import { TokenDisplay } from './TokenDisplay'

interface SwapWidgetProps {
  fromToken: Address
  toToken: Address
  onSwap?: (fromAmount: bigint, toAmount: bigint) => void
}

/**
 * SwapWidget utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SwapWidget.
 */
export function SwapWidget({ fromToken, toToken, onSwap }: SwapWidgetProps) {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return

    setIsSwapping(true)

    try {
      const fromBigInt = BigInt(fromAmount)
      const toBigInt = BigInt(toAmount)
      onSwap?.(fromBigInt, toBigInt)
    } catch (error) {
      console.error('Swap failed:', error)
    } finally {
      setIsSwapping(false)
    }
  }

  const handleFlip = () => {
    // Swap tokens and amounts
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">Swap Tokens</h2>

      {/* From Token */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">From</label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="0.0"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="flex-1"
          />
          <TokenDisplay address={fromToken} />
        </div>
      </div>

      {/* Flip Button */}
      <div className="flex justify-center">
        <button
          onClick={handleFlip}
          className="rounded-full bg-gray-700 p-2 hover:bg-gray-600"
          title="Flip tokens"
        >
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">To</label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="0.0"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            className="flex-1"
          />
          <TokenDisplay address={toToken} />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {fromAmount && (
          <ApprovalButton
            tokenAddress={fromToken}
            spenderAddress={toToken}
            amount={BigInt(fromAmount || '0')}
          />
        )}
        <Button
          onClick={handleSwap}
          disabled={!fromAmount || !toAmount || isSwapping}
          variant="primary"
          className="w-full"
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </Button>
      </div>
    </Card>
  )
}
