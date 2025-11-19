/**
 * Multiplayer module type exports
 */

// Re-export all types from services
export type {
  Room,
  Player,
  RoomStatus,
  RoomSettings,
  CreateRoomOptions,
  JoinRoomOptions,
} from '../services/RoomService'

export type { ChatMessage, ChatMessageType, ChatChannel } from '../services/ChatService'

export type { PlayerPresence, PresenceStatus } from '../services/PresenceService'

export type {
  GameStateSnapshot,
  PlayerState,
  EntityState,
  GameEvent,
  SyncConfig,
} from '../services/SyncService'

export type { LatencyMeasurement } from '../services/LatencyService'

export type { PlayerMatchProfile, Match } from '../services/MatchmakingService'

export type {
  WebSocketEventType,
  WebSocketEvent,
  EventHandler,
  WebSocketConfig,
} from '../services/WebSocketService'

// Additional multiplayer types
export interface MultiplayerConfig {
  serverUrl: string
  autoReconnect: boolean
  heartbeatInterval: number
  pingInterval: number
}

export interface PlayerInfo {
  id: string
  username: string
  avatar?: string
  level: number
  skillRating: number
}

export interface TeamInfo {
  id: string
  name: string
  color: string
  players: PlayerInfo[]
  score: number
}

export interface GameSession {
  id: string
  roomId: string
  mode: string
  startTime: number
  endTime?: number
  winner?: string
  teams?: TeamInfo[]
}

export interface MultiplayerStats {
  gamesPlayed: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageScore: number
  totalPlayTime: number
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime'
  entries: LeaderboardEntry[]
  updatedAt: number
}

export interface LeaderboardEntry {
  rank: number
  playerId: string
  username: string
  score: number
  gamesPlayed: number
  winRate: number
}

export interface Invite {
  id: string
  from: PlayerInfo
  roomId: string
  roomName: string
  expiresAt: number
}

export interface SpectatorInfo {
  playerId: string
  username: string
  joinedAt: number
}

export interface ReplayData {
  sessionId: string
  duration: number
  snapshots: GameStateSnapshot[]
  events: GameEvent[]
  metadata: {
    mode: string
    players: PlayerInfo[]
    winner?: string
  }
}
