/**
 * Multiplayer-related type definitions
 */

import type { Player, Obstacle, GameState } from './game'
import type { Address } from 'viem'

export interface MultiplayerRoom {
  id: string
  hostId: string
  players: Map<string, Player>
  maxPlayers: number
  status: GameState
  createdAt: number
  gameStartTime: number | null
  obstacles: Obstacle[]
}

export interface PlayerSyncData {
  id: string
  x: number
  y: number
  velocityY: number
  isJumping: boolean
  isAlive: boolean
  score: number
}

export interface RoomSyncData {
  roomId: string
  hostId: string
  players: PlayerSyncData[]
  status: GameState
  gameStartTime: number | null
  obstacles: Obstacle[]
}

export interface SocketEvent<T = unknown> {
  type: string
  payload: T
  senderId?: string
  timestamp: number
}

export interface JoinRoomPayload {
  playerId: string
  playerName: string
  roomId?: string
}

export interface LeaveRoomPayload {
  playerId: string
  roomId: string
}

export interface PlayerJumpPayload {
  playerId: string
  roomId: string
}

export interface PlayerPositionPayload {
  playerId: string
  roomId: string
  x: number
  y: number
  velocityY: number
  isJumping: boolean
}

export interface ObstacleSyncPayload {
  roomId: string
  obstacles: Obstacle[]
}

export interface GameStartPayload {
  roomId: string
  gameStartTime: number
}

export interface GameOverPayload {
  roomId: string
  winnerId: string | null
  scores: { playerId: string; score: number }[]
}

export interface ChatMessagePayload {
  roomId: string
  senderId: string
  message: string
  timestamp: number
}

export interface PlayerInfo {
  id: string
  name: string
  address?: Address
  color: string
  isHost: boolean
  isReady: boolean
}

export interface RoomInfo {
  id: string
  name: string
  host: string
  playerCount: number
  maxPlayers: number
  status: GameState
  isPrivate: boolean
  createdAt: number
}

export interface MultiplayerConfig {
  maxRooms: number
  maxPlayersPerRoom: number
  roomTimeout: number
  syncInterval: number
  enableVoiceChat: boolean
  enableTextChat: boolean
}

export interface MultiplayerStats {
  totalRooms: number
  activePlayers: number
  averagePlayersPerRoom: number
  uptime: number
}
