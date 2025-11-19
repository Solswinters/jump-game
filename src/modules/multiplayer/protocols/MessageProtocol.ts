/**
 * Message protocol definitions
 */

export enum MessageType {
  // Connection
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  PING = 'PING',
  PONG = 'PONG',

  // Room
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  ROOM_UPDATE = 'ROOM_UPDATE',
  ROOM_LIST = 'ROOM_LIST',

  // Player
  PLAYER_JOIN = 'PLAYER_JOIN',
  PLAYER_LEAVE = 'PLAYER_LEAVE',
  PLAYER_UPDATE = 'PLAYER_UPDATE',
  PLAYER_READY = 'PLAYER_READY',

  // Game
  GAME_START = 'GAME_START',
  GAME_END = 'GAME_END',
  GAME_STATE = 'GAME_STATE',
  GAME_ACTION = 'GAME_ACTION',

  // Chat
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  CHAT_HISTORY = 'CHAT_HISTORY',

  // Emote
  EMOTE = 'EMOTE',

  // Error
  ERROR = 'ERROR',
}

export interface Message<T = unknown> {
  type: MessageType
  payload: T
  timestamp: number
  id?: string
}

export interface ConnectPayload {
  playerId: string
  username: string
  token?: string
}

export interface RoomPayload {
  roomId: string
  name: string
  host: string
  maxPlayers: number
  currentPlayers: number
  isPrivate: boolean
  password?: string
}

export interface PlayerPayload {
  id: string
  name: string
  score: number
  isReady: boolean
}

export interface ChatPayload {
  playerId: string
  username: string
  message: string
}

export interface EmotePayload {
  playerId: string
  username: string
  type: string
  emoji: string
}

export interface ErrorPayload {
  code: string
  message: string
  details?: unknown
}

export class MessageProtocol {
  static encode<T>(type: MessageType, payload: T): string {
    const message: Message<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 15),
    }
    return JSON.stringify(message)
  }

  static decode(data: string): Message {
    try {
      const message = JSON.parse(data) as Message
      if (!message.type || !message.payload) {
        throw new Error('Invalid message format')
      }
      return message
    } catch (error) {
      throw new Error(`Failed to decode message: ${error}`)
    }
  }

  static createError(code: string, message: string, details?: unknown): string {
    return this.encode<ErrorPayload>(MessageType.ERROR, {
      code,
      message,
      details,
    })
  }
}
