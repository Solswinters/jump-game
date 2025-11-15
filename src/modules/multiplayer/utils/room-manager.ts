/**
 * Room management utilities for multiplayer
 */

export interface RoomInfo {
  id: string
  playerCount: number
  maxPlayers: number
  gameStarted: boolean
  createdAt: number
}

export function generateRoomId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `room-${timestamp}-${random}`
}

export function isRoomFull(room: RoomInfo): boolean {
  return room.playerCount >= room.maxPlayers
}

export function canJoinRoom(room: RoomInfo): boolean {
  return !room.gameStarted && !isRoomFull(room)
}

export function getRoomDisplayName(roomId: string): string {
  const parts = roomId.split('-')
  return parts.length >= 2 ? parts[1] : roomId
}

export function getRoomAge(room: RoomInfo): number {
  return Date.now() - room.createdAt
}

export function isRoomExpired(room: RoomInfo, maxAge: number = 300000): boolean {
  return getRoomAge(room) > maxAge
}

export function createRoomInfo(maxPlayers: number = 4): RoomInfo {
  return {
    id: generateRoomId(),
    playerCount: 0,
    maxPlayers,
    gameStarted: false,
    createdAt: Date.now(),
  }
}

export function getRoomStatusText(room: RoomInfo): string {
  if (room.gameStarted) {
    return 'In Progress'
  }
  if (isRoomFull(room)) {
    return 'Full'
  }
  return `${room.playerCount}/${room.maxPlayers} Players`
}

export function getRoomAvailableSlots(room: RoomInfo): number {
  return Math.max(0, room.maxPlayers - room.playerCount)
}

export interface RoomFilter {
  includeStarted?: boolean
  includeFull?: boolean
  maxAge?: number
}

export function filterRooms(rooms: RoomInfo[], filter: RoomFilter = {}): RoomInfo[] {
  const { includeStarted = false, includeFull = false, maxAge = 300000 } = filter

  return rooms.filter(room => {
    if (!includeStarted && room.gameStarted) {
      return false
    }
    if (!includeFull && isRoomFull(room)) {
      return false
    }
    if (isRoomExpired(room, maxAge)) {
      return false
    }
    return true
  })
}

export function sortRoomsByAvailability(rooms: RoomInfo[]): RoomInfo[] {
  return [...rooms].sort((a, b) => {
    // Prioritize rooms with players
    if (a.playerCount !== b.playerCount) {
      return b.playerCount - a.playerCount
    }
    // Then by creation time (newer first)
    return b.createdAt - a.createdAt
  })
}
