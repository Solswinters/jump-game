/**
 * Player synchronization utilities for multiplayer
 */

import type { Player } from '@/modules/game/domain/engine'

export interface PlayerPosition {
  x: number
  y: number
  velocityY: number
  isGrounded: boolean
}

export interface SyncPacket {
  playerId: string
  position: PlayerPosition
  score: number
  timestamp: number
}

export function createSyncPacket(player: Player): SyncPacket {
  return {
    playerId: player.id,
    position: {
      x: player.x,
      y: player.y,
      velocityY: player.velocityY,
      isGrounded: player.isGrounded,
    },
    score: player.score,
    timestamp: Date.now(),
  }
}

export function applyPositionUpdate(player: Player, position: PlayerPosition): Player {
  return {
    ...player,
    x: position.x,
    y: position.y,
    velocityY: position.velocityY,
    isGrounded: position.isGrounded,
  }
}

export function interpolatePosition(
  current: PlayerPosition,
  target: PlayerPosition,
  alpha: number
): PlayerPosition {
  return {
    x: current.x + (target.x - current.x) * alpha,
    y: current.y + (target.y - current.y) * alpha,
    velocityY: current.velocityY + (target.velocityY - current.velocityY) * alpha,
    isGrounded: alpha > 0.5 ? target.isGrounded : current.isGrounded,
  }
}

export function shouldSyncPosition(lastSync: number, syncInterval: number = 50): boolean {
  return Date.now() - lastSync >= syncInterval
}

export function calculateNetworkDelay(sentTimestamp: number): number {
  return Date.now() - sentTimestamp
}

export function predictPosition(
  position: PlayerPosition,
  velocityY: number,
  frames: number
): PlayerPosition {
  return {
    ...position,
    y: position.y + velocityY * frames,
    velocityY,
  }
}
