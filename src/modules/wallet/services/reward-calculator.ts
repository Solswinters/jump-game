/**
 * Reward calculation service
 */

import { GAME_CONSTANTS } from '@/constants/game'

export interface RewardCalculation {
  baseReward: bigint
  scoreBonus: bigint
  winnerBonus: bigint
  totalReward: bigint
}

export function calculateReward(score: number, isWinner: boolean): RewardCalculation {
  const baseReward = BigInt(GAME_CONSTANTS.BASE_REWARD) * BigInt(10 ** 18)
  const scoreBonus = (BigInt(score) * BigInt(10 ** 18)) / BigInt(GAME_CONSTANTS.SCORE_BONUS_DIVISOR)

  const subtotal = baseReward + scoreBonus
  const winnerBonus = isWinner
    ? (subtotal * BigInt(Math.floor(GAME_CONSTANTS.WINNER_MULTIPLIER * 100 - 100))) / BigInt(100)
    : BigInt(0)

  const totalReward = subtotal + winnerBonus

  return {
    baseReward,
    scoreBonus,
    winnerBonus,
    totalReward,
  }
}

export function formatRewardAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === BigInt(0)) {
    return integerPart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmed = fractionalStr.replace(/0+$/, '').slice(0, 4)

  return `${integerPart}.${trimmed}`
}

export function estimateReward(score: number, isWinner: boolean): string {
  const calculation = calculateReward(score, isWinner)
  return formatRewardAmount(calculation.totalReward)
}

export function canClaimReward(
  lastClaimTime: number,
  cooldownPeriod: number = GAME_CONSTANTS.COOLDOWN_PERIOD
): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime - lastClaimTime >= cooldownPeriod
}

export function getTimeUntilNextClaim(
  lastClaimTime: number,
  cooldownPeriod: number = GAME_CONSTANTS.COOLDOWN_PERIOD
): number {
  const currentTime = Math.floor(Date.now() / 1000)
  const nextClaimTime = lastClaimTime + cooldownPeriod
  return Math.max(0, nextClaimTime - currentTime)
}

export function formatCooldownTime(seconds: number): string {
  if (seconds <= 0) {
    return 'Now'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}
