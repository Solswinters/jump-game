import { z } from 'zod'

// Ethereum address validation
export const EthereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

// Transaction hash validation
export const TransactionHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')

// Signature validation
export const SignatureSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature')

// Player stats validation
export const PlayerStatsSchema = z.object({
  gamesPlayed: z.number().int().min(0),
  totalClaimed: z.string(),
  highestScore: z.number().int().min(0),
  lastClaimTime: z.number().int().min(0),
})

// Reward calculation validation
export const RewardCalculationSchema = z.object({
  score: z.number().int().min(0),
  isWinner: z.boolean(),
  multiplier: z.number().positive(),
})

