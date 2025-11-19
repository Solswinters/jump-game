/**
 * Room/Lobby service for multiplayer games
 */

export interface Room {
  id: string
  name: string
  hostId: string
  players: Player[]
  maxPlayers: number
  isPrivate: boolean
  password?: string
  status: RoomStatus
  gameMode: string
  createdAt: number
  settings: RoomSettings
}

export interface Player {
  id: string
  username: string
  isReady: boolean
  isHost: boolean
  joinedAt: number
  avatar?: string
}

export type RoomStatus = 'waiting' | 'starting' | 'in_progress' | 'finished'

export interface RoomSettings {
  difficulty: string
  timeLimit?: number
  scoreLimit?: number
  allowSpectators: boolean
  [key: string]: unknown
}

export interface CreateRoomOptions {
  name: string
  maxPlayers: number
  isPrivate: boolean
  password?: string
  gameMode: string
  settings?: Partial<RoomSettings>
}

export interface JoinRoomOptions {
  roomId: string
  password?: string
}

export class RoomService {
  private rooms = new Map<string, Room>()
  private currentRoomId: string | null = null

  /**
   * Create a new room
   */
  createRoom(hostId: string, hostUsername: string, options: CreateRoomOptions): Room {
    const room: Room = {
      id: this.generateRoomId(),
      name: options.name,
      hostId,
      players: [
        {
          id: hostId,
          username: hostUsername,
          isReady: false,
          isHost: true,
          joinedAt: Date.now(),
        },
      ],
      maxPlayers: options.maxPlayers,
      isPrivate: options.isPrivate,
      password: options.password,
      status: 'waiting',
      gameMode: options.gameMode,
      createdAt: Date.now(),
      settings: {
        difficulty: 'normal',
        allowSpectators: true,
        ...options.settings,
      },
    }

    this.rooms.set(room.id, room)
    this.currentRoomId = room.id
    return room
  }

  /**
   * Join an existing room
   */
  joinRoom(roomId: string, playerId: string, username: string, password?: string): Room | null {
    const room = this.rooms.get(roomId)

    if (!room) {
      throw new Error('Room not found')
    }

    if (room.status !== 'waiting') {
      throw new Error('Room is not accepting players')
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full')
    }

    if (room.isPrivate && room.password !== password) {
      throw new Error('Invalid password')
    }

    const player: Player = {
      id: playerId,
      username,
      isReady: false,
      isHost: false,
      joinedAt: Date.now(),
    }

    room.players.push(player)
    this.currentRoomId = roomId
    return room
  }

  /**
   * Leave current room
   */
  leaveRoom(playerId: string): void {
    if (!this.currentRoomId) return

    const room = this.rooms.get(this.currentRoomId)
    if (!room) return

    const playerIndex = room.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) return

    room.players.splice(playerIndex, 1)

    // If host left, assign new host
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id
      room.players[0].isHost = true
    }

    // Delete room if empty
    if (room.players.length === 0) {
      this.rooms.delete(room.id)
    }

    this.currentRoomId = null
  }

  /**
   * Update player ready status
   */
  setPlayerReady(playerId: string, isReady: boolean): void {
    if (!this.currentRoomId) return

    const room = this.rooms.get(this.currentRoomId)
    if (!room) return

    const player = room.players.find(p => p.id === playerId)
    if (player) {
      player.isReady = isReady
    }
  }

  /**
   * Check if all players are ready
   */
  areAllPlayersReady(roomId: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room || room.players.length < 2) return false

    return room.players.every(p => p.isReady || p.isHost)
  }

  /**
   * Start game in room
   */
  startGame(roomId: string, hostId: string): void {
    const room = this.rooms.get(roomId)
    if (!room) throw new Error('Room not found')

    if (room.hostId !== hostId) {
      throw new Error('Only host can start the game')
    }

    if (!this.areAllPlayersReady(roomId)) {
      throw new Error('Not all players are ready')
    }

    room.status = 'starting'
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId)
  }

  /**
   * Get current room
   */
  getCurrentRoom(): Room | null {
    if (!this.currentRoomId) return null
    return this.rooms.get(this.currentRoomId) ?? null
  }

  /**
   * Get all available rooms
   */
  getAvailableRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(
      room => room.status === 'waiting' && !room.isPrivate
    )
  }

  /**
   * Update room settings
   */
  updateRoomSettings(roomId: string, hostId: string, settings: Partial<RoomSettings>): void {
    const room = this.rooms.get(roomId)
    if (!room) throw new Error('Room not found')

    if (room.hostId !== hostId) {
      throw new Error('Only host can update settings')
    }

    room.settings = { ...room.settings, ...settings }
  }

  /**
   * Generate unique room ID
   */
  private generateRoomId(): string {
    return `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }
}
