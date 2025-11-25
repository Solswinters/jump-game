/**
 * Reconnection utilities
 */

export interface ReconnectionState {
  attempts: number
  lastAttempt: number
  nextAttempt: number
  isReconnecting: boolean
}

/**
 * createReconnectionState utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createReconnectionState.
 */
export function createReconnectionState(): ReconnectionState {
  return {
    attempts: 0,
    lastAttempt: 0,
    nextAttempt: 0,
    isReconnecting: false,
  }
}

/**
 * calculateBackoff utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateBackoff.
 */
export function calculateBackoff(
  attempt: number,
  baseDelay = 1000,
  maxDelay = 30000,
  multiplier = 2,
  jitter = true
): number {
  let delay = Math.min(baseDelay * Math.pow(multiplier, attempt), maxDelay)

  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5)
  }

  return Math.floor(delay)
}

/**
 * shouldAttemptReconnect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of shouldAttemptReconnect.
 */
export function shouldAttemptReconnect(
  state: ReconnectionState,
  maxAttempts = 5,
  errorCode?: string
): boolean {
  // Don't reconnect if max attempts reached
  if (state.attempts >= maxAttempts) return false

  // Don't reconnect for fatal errors
  const fatalErrors = ['AUTH_FAILED', 'BANNED', 'INVALID_VERSION']
  if (errorCode && fatalErrors.includes(errorCode)) return false

  // Don't reconnect if already reconnecting
  if (state.isReconnecting) return false

  return true
}

/**
 * canReconnectNow utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of canReconnectNow.
 */
export function canReconnectNow(state: ReconnectionState): boolean {
  return Date.now() >= state.nextAttempt
}

/**
 * updateReconnectionState utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of updateReconnectionState.
 */
export function updateReconnectionState(
  state: ReconnectionState,
  delay: number
): ReconnectionState {
  return {
    attempts: state.attempts + 1,
    lastAttempt: Date.now(),
    nextAttempt: Date.now() + delay,
    isReconnecting: true,
  }
}

/**
 * resetReconnectionState utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of resetReconnectionState.
 */
export function resetReconnectionState(state: ReconnectionState): ReconnectionState {
  return {
    attempts: 0,
    lastAttempt: 0,
    nextAttempt: 0,
    isReconnecting: false,
  }
}

/**
 * getReconnectMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getReconnectMessage.
 */
export function getReconnectMessage(attempt: number, maxAttempts: number): string {
  if (attempt === 1) return 'Connection lost. Reconnecting...'
  if (attempt >= maxAttempts) return 'Unable to reconnect. Please refresh.'
  return `Reconnecting... (${attempt}/${maxAttempts})`
}

/**
 * estimateReconnectTime utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of estimateReconnectTime.
 */
export function estimateReconnectTime(state: ReconnectionState): number {
  if (!state.isReconnecting) return 0
  return Math.max(0, state.nextAttempt - Date.now())
}
