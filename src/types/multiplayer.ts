/**
 * Multiplayer type definitions
 */

import type { Player, Obstacle } from '@/modules/game/domain/engine'

export interface Room {
  id: string
  name: string
  hostId: string
  playerIds: string[]
  maxPlayers: number
  gameStarted: boolean
  createdAt: number
}

export interface RoomState {
  room: Room
  players: Map<string, Player>
  obstacles: Obstacle[]
  gameTime: number
}

export interface MultiplayerMessage {
  type: 'join' | 'leave' | 'start' | 'update' | 'chat'
  playerId: string
  data?: unknown
  timestamp: number
}

export interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: number
}

export interface PlayerUpdate {
  playerId: string
  position: {
    x: number
    y: number
    velocityY: number
    isGrounded: boolean
  }
  score: number
  isAlive: boolean
}

export interface GameOverData {
  winnerId: string
  scores: Array<{
    playerId: string
    score: number
  }>
  timestamp: number
}

export interface LobbyInfo {
  availableRooms: Room[]
  totalPlayers: number
  activePlayers: number
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface MultiplayerConfig {
  socketUrl: string
  reconnectionAttempts: number
  reconnectionDelay: number
  timeout: number
}
