/**
 * Lobby utilities
 */

import type { Room, Player } from '../types'

export function canJoinRoom(room: Room, password?: string): boolean {
  if (room.currentPlayers >= room.maxPlayers) return false
  if (room.isPrivate && !password) return false
  return true
}

export function isRoomFull(room: Room): boolean {
  return room.currentPlayers >= room.maxPlayers
}

export function isRoomEmpty(room: Room): boolean {
  return room.currentPlayers === 0
}

export function getRoomStatus(room: Room): 'open' | 'full' | 'starting' | 'in_progress' {
  if (room.currentPlayers >= room.maxPlayers) return 'full'
  if (room.currentPlayers === 0) return 'open'
  return 'open'
}

export function shouldStartGame(players: Player[], minPlayers = 2): boolean {
  if (players.length < minPlayers) return false
  return players.every(p => p.isReady || p.isHost)
}

export function getReadyPlayerCount(players: Player[]): number {
  return players.filter(p => p.isReady).length
}

export function getHostPlayer(players: Player[]): Player | undefined {
  return players.find(p => p.isHost)
}

export function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

export function sortPlayersByName(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.name.localeCompare(b.name))
}

export function sortPlayersByJoinTime(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.joinedAt - b.joinedAt)
}

export function assignTeams(players: Player[], teamCount = 2): Player[][] {
  const teams: Player[][] = Array.from({ length: teamCount }, () => [])
  const shuffled = [...players].sort(() => Math.random() - 0.5)

  shuffled.forEach((player, index) => {
    teams[index % teamCount].push(player)
  })

  return teams
}

export function balanceTeams(teams: Player[][]): Player[][] {
  // Simple balance by moving players from larger to smaller teams
  const balanced = teams.map(team => [...team])

  while (true) {
    const sizes = balanced.map(team => team.length)
    const maxSize = Math.max(...sizes)
    const minSize = Math.min(...sizes)

    if (maxSize - minSize <= 1) break

    const largestIndex = sizes.indexOf(maxSize)
    const smallestIndex = sizes.indexOf(minSize)

    const player = balanced[largestIndex].pop()
    if (player) {
      balanced[smallestIndex].push(player)
    }
  }

  return balanced
}
