import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PORT: z.string().default('3000'),

  // Blockchain
  NEXT_PUBLIC_GAME_TOKEN_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_GAME_REWARDS_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_CHAIN_ID: z.string().default('8453'), // Base mainnet

  // API Keys
  VERIFIER_PRIVATE_KEY: z.string().optional(),
  BASESCAN_API_KEY: z.string().optional(),
  PRIVATE_KEY: z.string().optional(),

  // Features
  NEXT_PUBLIC_ENABLE_MULTIPLAYER: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_REWARDS: z.string().default('true'),
  NEXT_PUBLIC_MAX_PLAYERS_PER_ROOM: z.string().default('4'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  // Socket.io
  SOCKET_CORS_ORIGIN: z.string().optional(),
})

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:')
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
    }
    throw new Error('Invalid environment variables')
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type-safe environment variable access
export const config = {
  app: {
    env: env.NODE_ENV,
    url: env.NEXT_PUBLIC_APP_URL || `http://localhost:${env.PORT}`,
    port: parseInt(env.PORT, 10),
  },
  blockchain: {
    gameTokenAddress: env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS as `0x${string}` | undefined,
    gameRewardsAddress: env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS as `0x${string}` | undefined,
    chainId: parseInt(env.NEXT_PUBLIC_CHAIN_ID, 10),
  },
  features: {
    enableMultiplayer: env.NEXT_PUBLIC_ENABLE_MULTIPLAYER === 'true',
    enableRewards: env.NEXT_PUBLIC_ENABLE_REWARDS === 'true',
    maxPlayersPerRoom: parseInt(env.NEXT_PUBLIC_MAX_PLAYERS_PER_ROOM, 10),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  keys: {
    verifierPrivateKey: env.VERIFIER_PRIVATE_KEY,
    basescanApiKey: env.BASESCAN_API_KEY,
    privateKey: env.PRIVATE_KEY,
  },
  socket: {
    corsOrigin: env.SOCKET_CORS_ORIGIN || env.NEXT_PUBLIC_APP_URL || `http://localhost:${env.PORT}`,
  },
} as const

// Type exports
export type AppConfig = typeof config
export type Environment = z.infer<typeof envSchema>

