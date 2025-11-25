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

/**
 * createSyncPacket utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createSyncPacket.
 */
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

/**
 * applyPositionUpdate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of applyPositionUpdate.
 */
export function applyPositionUpdate(player: Player, position: PlayerPosition): Player {
  return {
    ...player,
    x: position.x,
    y: position.y,
    velocityY: position.velocityY,
    isGrounded: position.isGrounded,
  }
}

/**
 * interpolatePosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of interpolatePosition.
 */
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

/**
 * shouldSyncPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of shouldSyncPosition.
 */
export function shouldSyncPosition(lastSync: number, syncInterval: number = 50): boolean {
  return Date.now() - lastSync >= syncInterval
}

/**
 * calculateNetworkDelay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateNetworkDelay.
 */
export function calculateNetworkDelay(sentTimestamp: number): number {
  return Date.now() - sentTimestamp
}

/**
 * predictPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of predictPosition.
 */
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
