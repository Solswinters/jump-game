/**
 * Multiplayer sorting utilities
 */

import type { Room, Player } from '../types'

export function sortRoomsByPlayers(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.currentPlayers - a.currentPlayers)
}

export function sortRoomsByCreated(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.createdAt - a.createdAt)
}

export function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

export function sortPlayersByName(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.name.localeCompare(b.name))
}

export function sortPlayersByJoinTime(players: Player[]): Player[] {
  return [...rooms].sort((a, b) => a.joinedAt - b.joinedAt)
}

export function filterAvailableRooms(rooms: Room[]): Room[] {
  return rooms.filter(room => room.currentPlayers < room.maxPlayers)
}

export function filterPublicRooms(rooms: Room[]): Room[] {
  return rooms.filter(room => !room.isPrivate)
}

export function searchRooms(rooms: Room[], query: string): Room[] {
  const lowercaseQuery = query.toLowerCase()
  return rooms.filter(
    room =>
      room.name.toLowerCase().includes(lowercaseQuery) ||
      room.host.toLowerCase().includes(lowercaseQuery)
  )
}
