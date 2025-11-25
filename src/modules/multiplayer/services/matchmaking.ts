/**
 * Matchmaking service for multiplayer
 */

import type { RoomInfo } from '@/modules/multiplayer/utils/room-manager'

class MatchmakingService {
  private availableRooms: RoomInfo[] = []
  private searchingPlayers: Set<string> = new Set()

  addRoom(room: RoomInfo): void {
    this.availableRooms.push(room)
  }

  removeRoom(roomId: string): void {
    this.availableRooms = this.availableRooms.filter((r) => r.id !== roomId)
  }

  updateRoom(roomId: string, updates: Partial<RoomInfo>): void {
    const room = this.availableRooms.find((r) => r.id === roomId)
    if (room) {
      Object.assign(room, updates)
    }
  }

  findAvailableRoom(): RoomInfo | null {
    // Find rooms that aren't full and haven't started
    const available = this.availableRooms.filter(
      (r) => !r.gameStarted && r.playerCount < r.maxPlayers
    )

    if (available.length === 0) {
      return null
    }

    // Sort by player count (prefer rooms with more players)
    available.sort((a, b) => b.playerCount - a.playerCount)

    return available[0] ?? null
  }

  getAvailableRooms(): RoomInfo[] {
    return this.availableRooms.filter((r) => !r.gameStarted && r.playerCount < r.maxPlayers)
  }

  getRoom(roomId: string): RoomInfo | null {
    return this.availableRooms.find((r) => r.id === roomId) ?? null
  }

  startSearch(playerId: string): void {
    this.searchingPlayers.add(playerId)
  }

  stopSearch(playerId: string): void {
    this.searchingPlayers.delete(playerId)
  }

  isSearching(playerId: string): boolean {
    return this.searchingPlayers.has(playerId)
  }

  getSearchingPlayersCount(): number {
    return this.searchingPlayers.size
  }

  matchPlayers(minPlayers: number = 2): string[][] {
    const searching = Array.from(this.searchingPlayers)
    const matches: string[][] = []

    for (let i = 0; i < searching.length; i += minPlayers) {
      const match = searching.slice(i, i + minPlayers)
      if (match.length >= minPlayers) {
        matches.push(match)
        match.forEach((id) => this.stopSearch(id))
      }
    }

    return matches
  }

  getRoomStats(): {
    totalRooms: number
    availableRooms: number
    activeGames: number
    totalPlayers: number
  } {
    const activeGames = this.availableRooms.filter((r) => r.gameStarted).length
    const totalPlayers = this.availableRooms.reduce((sum, r) => sum + r.playerCount, 0)

    return {
      totalRooms: this.availableRooms.length,
      availableRooms: this.getAvailableRooms().length,
      activeGames,
      totalPlayers,
    }
  }

  clearStaleRooms(maxAge: number = 300000): number {
    const now = Date.now()
    const initialCount = this.availableRooms.length

    this.availableRooms = this.availableRooms.filter(
      (r) => now - r.createdAt < maxAge || r.gameStarted
    )

    return initialCount - this.availableRooms.length
  }
}

/**
 * matchmakingService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of matchmakingService.
 */
export const matchmakingService = new MatchmakingService()
