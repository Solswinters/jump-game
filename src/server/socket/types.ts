// Socket.io server types and interfaces

export interface ServerToClientEvents {
  // Player events
  playerJoined: (data: { playerId: string; playerName: string; roomId: string }) => void
  playerLeft: (data: { playerId: string; roomId: string }) => void
  playerReady: (data: { playerId: string; isReady: boolean }) => void

  // Game state events
  gameStateUpdate: (data: GameStateUpdate) => void
  gameStarted: (data: { roomId: string; startTime: number }) => void
  gameEnded: (data: GameEndData) => void

  // Room events
  roomCreated: (data: RoomData) => void
  roomUpdated: (data: RoomData) => void
  roomClosed: (data: { roomId: string; reason: string }) => void
  roomList: (data: { rooms: RoomInfo[] }) => void

  // Error events
  error: (data: { code: string; message: string }) => void

  // Ping/pong for latency measurement
  pong: (data: { timestamp: number }) => void
}

export interface ClientToServerEvents {
  // Room management
  createRoom: (data: CreateRoomData, callback: (response: RoomResponse) => void) => void
  joinRoom: (data: JoinRoomData, callback: (response: RoomResponse) => void) => void
  leaveRoom: (data: { roomId: string }, callback: (response: BasicResponse) => void) => void
  getRooms: (callback: (response: RoomsListResponse) => void) => void

  // Player actions
  setReady: (data: { roomId: string; isReady: boolean }) => void
  updatePlayer: (data: PlayerUpdate) => void

  // Game actions
  startGame: (data: { roomId: string }) => void
  gameAction: (data: GameAction) => void

  // Latency measurement
  ping: (data: { timestamp: number }) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  playerId: string
  playerName: string
  address?: string
  roomId?: string
}

// Data interfaces
export interface CreateRoomData {
  roomName: string
  maxPlayers: number
  isPrivate: boolean
  password?: string
  playerName: string
  address?: string
}

export interface JoinRoomData {
  roomId: string
  playerName: string
  password?: string
  address?: string
}

export interface RoomData {
  roomId: string
  roomName: string
  hostId: string
  players: Player[]
  maxPlayers: number
  isPrivate: boolean
  status: 'waiting' | 'playing' | 'finished'
  createdAt: number
}

export interface RoomInfo {
  roomId: string
  roomName: string
  currentPlayers: number
  maxPlayers: number
  isPrivate: boolean
  status: 'waiting' | 'playing' | 'finished'
}

export interface Player {
  playerId: string
  playerName: string
  address?: string
  isHost: boolean
  isReady: boolean
  score: number
  position: PlayerPosition
}

export interface PlayerPosition {
  x: number
  y: number
  velocityY: number
}

export interface PlayerUpdate {
  roomId: string
  position: PlayerPosition
  score?: number
}

export interface GameStateUpdate {
  roomId: string
  players: Record<string, Player>
  obstacles: Obstacle[]
  gameTime: number
}

export interface Obstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export interface GameAction {
  roomId: string
  type: 'jump' | 'move' | 'collect'
  timestamp: number
  data?: unknown
}

export interface GameEndData {
  roomId: string
  winner: string
  players: Array<{
    playerId: string
    playerName: string
    score: number
    rank: number
  }>
  duration: number
}

// Response interfaces
export interface BasicResponse {
  success: boolean
  error?: {
    code: string
    message: string
  }
}

export interface RoomResponse extends BasicResponse {
  room?: RoomData
}

export interface RoomsListResponse extends BasicResponse {
  rooms?: RoomInfo[]
}
