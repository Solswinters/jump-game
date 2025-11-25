/**
 * Gas cost display component
 */

'use client'

import { type Address } from 'viem'
import { useGasEstimate } from '../hooks/useGasEstimate'

export interface GasDisplayProps {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
  value?: bigint
}

/**
 * GasDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GasDisplay.
 */
export function GasDisplay({ address, abi, functionName, args, value }: GasDisplayProps) {
  const { estimation, isLoading, error } = useGasEstimate({
    address,
    abi,
    functionName,
    args,
    value,
    enabled: true,
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-gray-300" />
        <span>Estimating gas...</span>
      </div>
    )
  }

  if (error || !estimation) {
    return <div className="text-sm text-red-400">Gas estimation unavailable</div>
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Estimated Gas Cost:</span>
        <div className="text-right">
          <div className="font-semibold text-white">{estimation.totalCostEth} ETH</div>
          <div className="text-xs text-gray-500">{estimation.totalCostGwei} Gwei</div>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Gas Limit: {estimation.gasLimit.toString()}</span>
        <span>Gas Price: {estimation.gasPrice.toString()}</span>
      </div>
    </div>
  )
}
