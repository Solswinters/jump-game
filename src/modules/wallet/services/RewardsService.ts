/**
 * Rewards claiming and management service
 */

import { type Address } from 'viem'
import { contractService } from './ContractService'
import { GameRewardsABI } from '../abi/GameRewards'
import { logger } from '@/shared/logger'

export interface PlayerStats {
  totalGames: bigint
  totalScore: bigint
  highScore: bigint
  totalRewards: bigint
}

export class RewardsService {
  constructor(private contractAddress: Address) {}

  async claimReward(score: number): Promise<void> {
    try {
      logger.info('Claiming reward', { score })

      await contractService.writeAndWait({
        address: this.contractAddress,
        abi: GameRewardsABI,
        functionName: 'claimReward',
        args: [BigInt(score)],
      })

      logger.info('Reward claimed successfully')
    } catch (error) {
      logger.error('Failed to claim reward', { error })
      throw error
    }
  }

  async getPendingRewards(playerAddress: Address): Promise<bigint> {
    return contractService.read<bigint>({
      address: this.contractAddress,
      abi: GameRewardsABI,
      functionName: 'getPendingRewards',
      args: [playerAddress],
    })
  }

  async getTotalClaimed(playerAddress: Address): Promise<bigint> {
    return contractService.read<bigint>({
      address: this.contractAddress,
      abi: GameRewardsABI,
      functionName: 'getTotalClaimed',
      args: [playerAddress],
    })
  }

  async getPlayerStats(playerAddress: Address): Promise<PlayerStats> {
    const stats = await contractService.read<[bigint, bigint, bigint, bigint]>({
      address: this.contractAddress,
      abi: GameRewardsABI,
      functionName: 'getPlayerStats',
      args: [playerAddress],
    })

    return {
      totalGames: stats[0],
      totalScore: stats[1],
      highScore: stats[2],
      totalRewards: stats[3],
    }
  }

  async getRewardRate(): Promise<bigint> {
    return contractService.read<bigint>({
      address: this.contractAddress,
      abi: GameRewardsABI,
      functionName: 'rewardRate',
      args: [],
    })
  }

  calculateEstimatedReward(score: number, rate: bigint): bigint {
    return BigInt(score) * rate
  }
}
