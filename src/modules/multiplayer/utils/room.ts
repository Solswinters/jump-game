/**
 * Multiplayer room utilities
 */

import { MAX_PLAYERS_PER_ROOM, MIN_PLAYERS_TO_START } from '../constants'

export interface Room {
  id: string
  name: string
  playerCount: number
  maxPlayers: number
  isStarted: boolean
  isPrivate: boolean
}

/**
 * canJoinRoom utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of canJoinRoom.
 */
export function canJoinRoom(room: Room): boolean {
  return room.playerCount < room.maxPlayers && !room.isStarted
}

/**
 * canStartGame utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of canStartGame.
 */
export function canStartGame(playerCount: number): boolean {
  return playerCount >= MIN_PLAYERS_TO_START
}

/**
 * isRoomFull utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isRoomFull.
 */
export function isRoomFull(room: Room): boolean {
  return room.playerCount >= room.maxPlayers
}

/**
 * generateRoomId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateRoomId.
 */
export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * createRoom utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createRoom.
 */
export function createRoom(name: string, isPrivate: boolean = false): Room {
  return {
    id: generateRoomId(),
    name,
    playerCount: 0,
    maxPlayers: MAX_PLAYERS_PER_ROOM,
    isStarted: false,
    isPrivate,
  }
}

/**
 * getRoomDisplayName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRoomDisplayName.
 */
export function getRoomDisplayName(room: Room): string {
  const privacy = room.isPrivate ? '🔒' : '🌐'
  return `${privacy} ${room.name} (${room.playerCount}/${room.maxPlayers})`
}

/**
 * filterAvailableRooms utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterAvailableRooms.
 */
export function filterAvailableRooms(rooms: Room[]): Room[] {
  return rooms.filter((room) => canJoinRoom(room) && !room.isPrivate)
}

/**
 * sortRoomsByPlayers utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortRoomsByPlayers.
 */
export function sortRoomsByPlayers(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.playerCount - a.playerCount)
}
