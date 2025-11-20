import { logger } from '@/lib/logger'

export interface GasEstimate {
  gasLimit: bigint
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
  estimatedCost: bigint
  estimatedCostInEth: string
}

export class GasEstimator {
  private static readonly DEFAULT_GAS_LIMIT = 100000n
  private static readonly PRIORITY_FEE_MULTIPLIER = 1.2
  private static readonly BASE_FEE_MULTIPLIER = 1.5

  static async estimateGas(
    contractAddress: string,
    data: string,
    value: bigint = 0n
  ): Promise<GasEstimate> {
    try {
      // In a real implementation, this would call web3 provider
      // For now, return mock estimates
      const gasLimit = this.DEFAULT_GAS_LIMIT
      const maxFeePerGas = 50000000000n // 50 gwei
      const maxPriorityFeePerGas = 2000000000n // 2 gwei
      const estimatedCost = gasLimit * maxFeePerGas

      return {
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        estimatedCost,
        estimatedCostInEth: this.weiToEth(estimatedCost),
      }
    } catch (error) {
      logger.error('Gas estimation failed:', error)
      throw new Error('Failed to estimate gas')
    }
  }

  static async getGasPrice(): Promise<{
    slow: bigint
    standard: bigint
    fast: bigint
  }> {
    try {
      // Mock gas prices (in gwei)
      return {
        slow: 30000000000n, // 30 gwei
        standard: 50000000000n, // 50 gwei
        fast: 70000000000n, // 70 gwei
      }
    } catch (error) {
      logger.error('Failed to get gas price:', error)
      throw new Error('Failed to get gas price')
    }
  }

  static weiToEth(wei: bigint): string {
    const eth = Number(wei) / 1e18
    return eth.toFixed(6)
  }

  static ethToWei(eth: number): bigint {
    return BigInt(Math.floor(eth * 1e18))
  }

  static calculatePriorityFee(baseFee: bigint): bigint {
    return BigInt(Math.floor(Number(baseFee) * this.PRIORITY_FEE_MULTIPLIER))
  }

  static calculateMaxFee(baseFee: bigint, priorityFee: bigint): bigint {
    return BigInt(Math.floor(Number(baseFee) * this.BASE_FEE_MULTIPLIER)) + priorityFee
  }
}
