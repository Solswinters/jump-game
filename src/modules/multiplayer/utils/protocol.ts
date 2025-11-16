/**
 * Multiplayer communication protocol
 */

import { SOCKET_EVENTS } from '@/constants/socket-events'
import type {
  JoinRoomPayload,
  LeaveRoomPayload,
  PlayerJumpPayload,
  PlayerPositionPayload,
  ObstacleSyncPayload,
  GameStartPayload,
  GameOverPayload,
  ChatMessagePayload,
  SocketEvent,
} from '@/types/multiplayer'

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

export class MultiplayerProtocol {
  static createJoinRoomEvent(payload: JoinRoomPayload): SocketEvent<JoinRoomPayload> {
    return {
      type: SOCKET_EVENTS.JOIN_ROOM,
      payload,
      timestamp: Date.now(),
    }
  }

  static createLeaveRoomEvent(payload: LeaveRoomPayload): SocketEvent<LeaveRoomPayload> {
    return {
      type: SOCKET_EVENTS.LEAVE_ROOM,
      payload,
      timestamp: Date.now(),
    }
  }

  static createPlayerJumpEvent(payload: PlayerJumpPayload): SocketEvent<PlayerJumpPayload> {
    return {
      type: SOCKET_EVENTS.PLAYER_JUMP,
      payload,
      timestamp: Date.now(),
    }
  }

  static createPositionUpdateEvent(
    payload: PlayerPositionPayload
  ): SocketEvent<PlayerPositionPayload> {
    return {
      type: SOCKET_EVENTS.UPDATE_POSITION,
      payload,
      timestamp: Date.now(),
    }
  }

  static createObstacleSyncEvent(payload: ObstacleSyncPayload): SocketEvent<ObstacleSyncPayload> {
    return {
      type: SOCKET_EVENTS.SYNC_OBSTACLES,
      payload,
      timestamp: Date.now(),
    }
  }

  static createGameStartEvent(payload: GameStartPayload): SocketEvent<GameStartPayload> {
    return {
      type: SOCKET_EVENTS.GAME_STARTED,
      payload,
      timestamp: Date.now(),
    }
  }

  static createGameOverEvent(payload: GameOverPayload): SocketEvent<GameOverPayload> {
    return {
      type: SOCKET_EVENTS.GAME_OVER,
      payload,
      timestamp: Date.now(),
    }
  }

  static createChatMessageEvent(payload: ChatMessagePayload): SocketEvent<ChatMessagePayload> {
    return {
      type: SOCKET_EVENTS.SEND_MESSAGE,
      payload,
      timestamp: Date.now(),
    }
  }

  static validateEvent<T>(event: unknown): event is SocketEvent<T> {
    if (typeof event !== 'object' || event === null) {
      return false
    }

    const socketEvent = event as Record<string, unknown>
    return (
      typeof socketEvent.type === 'string' &&
      socketEvent.payload !== undefined &&
      typeof socketEvent.timestamp === 'number'
    )
  }

  static isJoinRoomEvent(event: SocketEvent): event is SocketEvent<JoinRoomPayload> {
    return event.type === SOCKET_EVENTS.JOIN_ROOM
  }

  static isLeaveRoomEvent(event: SocketEvent): event is SocketEvent<LeaveRoomPayload> {
    return event.type === SOCKET_EVENTS.LEAVE_ROOM
  }

  static isPlayerJumpEvent(event: SocketEvent): event is SocketEvent<PlayerJumpPayload> {
    return event.type === SOCKET_EVENTS.PLAYER_JUMP
  }

  static isPositionUpdateEvent(event: SocketEvent): event is SocketEvent<PlayerPositionPayload> {
    return event.type === SOCKET_EVENTS.UPDATE_POSITION
  }

  static isObstacleSyncEvent(event: SocketEvent): event is SocketEvent<ObstacleSyncPayload> {
    return event.type === SOCKET_EVENTS.SYNC_OBSTACLES
  }

  static isGameStartEvent(event: SocketEvent): event is SocketEvent<GameStartPayload> {
    return event.type === SOCKET_EVENTS.GAME_STARTED
  }

  static isGameOverEvent(event: SocketEvent): event is SocketEvent<GameOverPayload> {
    return event.type === SOCKET_EVENTS.GAME_OVER
  }

  static isChatMessageEvent(event: SocketEvent): event is SocketEvent<ChatMessagePayload> {
    return (
      event.type === SOCKET_EVENTS.SEND_MESSAGE || event.type === SOCKET_EVENTS.MESSAGE_RECEIVED
    )
  }
}

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
