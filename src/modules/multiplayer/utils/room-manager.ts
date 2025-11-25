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

/**
 * generateRoomId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateRoomId.
 */
export function generateRoomId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `room-${timestamp}-${random}`
}

/**
 * isRoomFull utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isRoomFull.
 */
export function isRoomFull(room: RoomInfo): boolean {
  return room.playerCount >= room.maxPlayers
}

/**
 * canJoinRoom utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of canJoinRoom.
 */
export function canJoinRoom(room: RoomInfo): boolean {
  return !room.gameStarted && !isRoomFull(room)
}

/**
 * getRoomDisplayName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRoomDisplayName.
 */
export function getRoomDisplayName(roomId: string): string {
  const parts = roomId.split('-')
  return parts.length >= 2 ? parts[1] : roomId
}

/**
 * getRoomAge utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRoomAge.
 */
export function getRoomAge(room: RoomInfo): number {
  return Date.now() - room.createdAt
}

/**
 * isRoomExpired utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isRoomExpired.
 */
export function isRoomExpired(room: RoomInfo, maxAge: number = 300000): boolean {
  return getRoomAge(room) > maxAge
}

/**
 * createRoomInfo utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createRoomInfo.
 */
export function createRoomInfo(maxPlayers: number = 4): RoomInfo {
  return {
    id: generateRoomId(),
    playerCount: 0,
    maxPlayers,
    gameStarted: false,
    createdAt: Date.now(),
  }
}

/**
 * getRoomStatusText utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRoomStatusText.
 */
export function getRoomStatusText(room: RoomInfo): string {
  if (room.gameStarted) {
    return 'In Progress'
  }
  if (isRoomFull(room)) {
    return 'Full'
  }
  return `${room.playerCount}/${room.maxPlayers} Players`
}

/**
 * getRoomAvailableSlots utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRoomAvailableSlots.
 */
export function getRoomAvailableSlots(room: RoomInfo): number {
  return Math.max(0, room.maxPlayers - room.playerCount)
}

export interface RoomFilter {
  includeStarted?: boolean
  includeFull?: boolean
  maxAge?: number
}

/**
 * filterRooms utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterRooms.
 */
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

/**
 * sortRoomsByAvailability utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortRoomsByAvailability.
 */
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
