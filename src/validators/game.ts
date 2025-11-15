import { z } from 'zod'

export const PlayerSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  velocityY: z.number(),
  isJumping: z.boolean(),
  isGrounded: z.boolean(),
  score: z.number().int().min(0),
  isAlive: z.boolean(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export const ObstacleSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
})

export const GameStateSchema = z.object({
  gameSpeed: z.number().positive(),
  gameTime: z.number().min(0),
  difficulty: z.number().positive(),
  isMultiplayer: z.boolean(),
  roomId: z.string().optional(),
})

export const ScoreSchema = z.number().int().min(0).max(1000000)

export const GameOverDataSchema = z.object({
  score: ScoreSchema,
  isWinner: z.boolean(),
  finalTime: z.number().min(0),
  obstaclesCleared: z.number().int().min(0),
})

