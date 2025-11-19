/**
 * Multiplayer-specific error classes
 */

export class MultiplayerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MultiplayerError'
  }
}

export class ConnectionError extends MultiplayerError {
  constructor(message: string) {
    super(message)
    this.name = 'ConnectionError'
  }
}

export class RoomError extends MultiplayerError {
  constructor(message: string) {
    super(message)
    this.name = 'RoomError'
  }
}

export class MatchmakingError extends MultiplayerError {
  constructor(message: string) {
    super(message)
    this.name = 'MatchmakingError'
  }
}

export class SyncError extends MultiplayerError {
  constructor(message: string) {
    super(message)
    this.name = 'SyncError'
  }
}

export function isMultiplayerError(error: unknown): error is MultiplayerError {
  return error instanceof MultiplayerError
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
