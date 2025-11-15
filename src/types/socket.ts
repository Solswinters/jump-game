import { Player, Obstacle } from './game'

export interface RoomState {
  roomId: string
  players: Player[]
  obstacles: Obstacle[]
  gameStarted: boolean
  gameTime: number
  difficulty: number
}

export interface PlayerPosition {
  y: number
  velocityY: number
  isGrounded: boolean
}

export interface GameOverEvent {
  winnerId: string
  scores: Array<{
    playerId: string
    score: number
  }>
}

// Socket event type definitions
export type SocketEventName = keyof SocketEvents

export interface SocketEvents {
  // Client to Server
  'join-room': (roomId?: string) => void
  'leave-room': () => void
  'start-game': () => void
  'player-jump': () => void
  'player-died': () => void
  'update-position': (position: PlayerPosition) => void
  'update-score': (score: number) => void
  'sync-obstacles': (obstacles: Obstacle[]) => void

  // Server to Client
  'room-joined': (data: { roomId: string; playerId: string; player: Player }) => void
  'room-full': () => void
  'player-joined': (data: { playerId: string; player: Player }) => void
  'player-left': (playerId: string) => void
  'room-state': (state: RoomState) => void
  'game-started': () => void
  'player-jumped': (playerId: string) => void
  'position-updated': (data: { playerId: string; position: PlayerPosition }) => void
  'score-updated': (data: { playerId: string; score: number }) => void
  'obstacles-synced': (obstacles: Obstacle[]) => void
  'game-over': (data: GameOverEvent) => void
  'error': (error: { code: string; message: string }) => void
  'disconnect': (reason: string) => void
  'reconnect': (attemptNumber: number) => void
  'reconnect_failed': () => void
}

export type ClientToServerEvents = Pick<
  SocketEvents,
  | 'join-room'
  | 'leave-room'
  | 'start-game'
  | 'player-jump'
  | 'player-died'
  | 'update-position'
  | 'update-score'
  | 'sync-obstacles'
>

export type ServerToClientEvents = Pick<
  SocketEvents,
  | 'room-joined'
  | 'room-full'
  | 'player-joined'
  | 'player-left'
  | 'room-state'
  | 'game-started'
  | 'player-jumped'
  | 'position-updated'
  | 'score-updated'
  | 'obstacles-synced'
  | 'game-over'
  | 'error'
  | 'disconnect'
  | 'reconnect'
  | 'reconnect_failed'
>

