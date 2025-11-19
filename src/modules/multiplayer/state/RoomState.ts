/**
 * Room state management
 */

import type { Room, Player } from '../types'

export class RoomState {
  private currentRoom: Room | null = null
  private players: Map<string, Player> = new Map()
  private listeners: Set<() => void> = new Set()

  setRoom(room: Room | null): void {
    this.currentRoom = room
    this.notify()
  }

  getRoom(): Room | null {
    return this.currentRoom
  }

  isInRoom(): boolean {
    return this.currentRoom !== null
  }

  updateRoom(updates: Partial<Room>): void {
    if (this.currentRoom) {
      this.currentRoom = { ...this.currentRoom, ...updates }
      this.notify()
    }
  }

  addPlayer(player: Player): void {
    this.players.set(player.id, player)
    this.notify()
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId)
    this.notify()
  }

  updatePlayer(playerId: string, updates: Partial<Player>): void {
    const player = this.players.get(playerId)
    if (player) {
      this.players.set(playerId, { ...player, ...updates })
      this.notify()
    }
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId)
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  getPlayerCount(): number {
    return this.players.size
  }

  clearPlayers(): void {
    this.players.clear()
    this.notify()
  }

  reset(): void {
    this.currentRoom = null
    this.players.clear()
    this.notify()
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private notify(): void {
    this.listeners.forEach(callback => callback())
  }

  getSnapshot() {
    return {
      room: this.currentRoom,
      players: this.getPlayers(),
      playerCount: this.getPlayerCount(),
    }
  }
}
