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

/**
 * isMultiplayerError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isMultiplayerError.
 */
export function isMultiplayerError(error: unknown): error is MultiplayerError {
  return error instanceof MultiplayerError
}

/**
 * getErrorMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getErrorMessage.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
