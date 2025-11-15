/**
 * Gas estimation utilities
 */

export interface GasEstimate {
  gasLimit: bigint
  gasPrice: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  estimatedCost: bigint
}

export function calculateGasCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice
}

export function addGasBuffer(estimate: bigint, bufferPercent: number = 20): bigint {
  const buffer = (estimate * BigInt(bufferPercent)) / BigInt(100)
  return estimate + buffer
}

export function formatGasPrice(gasPrice: bigint): string {
  // Convert from wei to gwei
  const gwei = Number(gasPrice) / 1e9
  return `${gwei.toFixed(2)} gwei`
}

export function estimateTransactionTime(gasPrice: bigint): string {
  const gwei = Number(gasPrice) / 1e9

  if (gwei < 10) {
    return '~5+ minutes'
  }
  if (gwei < 30) {
    return '~2-5 minutes'
  }
  if (gwei < 50) {
    return '~1-2 minutes'
  }
  return '~30 seconds'
}

export function getGasPriceLevel(gasPrice: bigint): 'low' | 'medium' | 'high' {
  const gwei = Number(gasPrice) / 1e9

  if (gwei < 20) {
    return 'low'
  }
  if (gwei < 50) {
    return 'medium'
  }
  return 'high'
}

export function suggestGasPrice(baseGas: bigint, speed: 'slow' | 'normal' | 'fast'): bigint {
  const multipliers = {
    slow: 80n,
    normal: 100n,
    fast: 130n,
  }

  return (baseGas * multipliers[speed]) / 100n
}
