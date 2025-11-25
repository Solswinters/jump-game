/**
 * Hook for gas estimation
 */

import { useState, useEffect } from 'react'
import { type Address } from 'viem'
import { gasService, type GasEstimation } from '../services/GasService'

export interface UseGasEstimateParams {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
  value?: bigint
  enabled?: boolean
}

/**
 * useGasEstimate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useGasEstimate.
 */
export function useGasEstimate(params: UseGasEstimateParams) {
  const [estimation, setEstimation] = useState<GasEstimation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!params.enabled) return

    const fetchEstimation = async () => {
      try {
        setIsLoading(true)
        const est = await gasService.getGasEstimation(
          params.address,
          params.abi,
          params.functionName,
          params.args,
          params.value
        )
        setEstimation(est)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchEstimation()
  }, [params.address, params.functionName, params.enabled])

  return {
    estimation,
    isLoading,
    error,
  }
}
