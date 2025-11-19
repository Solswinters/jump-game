/**
 * Multiplayer module constants
 */

export const ROOM_STATUS = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  IN_LOBBY: 'in-lobby',
  IN_GAME: 'in-game',
  FINISHED: 'finished',
} as const

export const CONNECTION_QUALITY = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const

export const MATCHMAKING_MODES = {
  CASUAL: 'casual',
  RANKED: 'ranked',
  CUSTOM: 'custom',
} as const

export const MAX_PLAYERS_PER_ROOM = 4

export const MIN_PLAYERS_TO_START = 2

export const LOBBY_TIMEOUT = 60000 // 60 seconds

export const SYNC_INTERVAL = 50 // 20 updates per second

export const MAX_PING = 500 // Max acceptable ping in ms

export const RECONNECT_ATTEMPTS = 3

export const RECONNECT_DELAY = 1000

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS]
export type ConnectionQuality = (typeof CONNECTION_QUALITY)[keyof typeof CONNECTION_QUALITY]
export type MatchmakingMode = (typeof MATCHMAKING_MODES)[keyof typeof MATCHMAKING_MODES]
