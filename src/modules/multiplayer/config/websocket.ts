/**
 * WebSocket configuration
 */

/**
 * WEBSOCKET_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WEBSOCKET_CONFIG.
 */
export const WEBSOCKET_CONFIG = {
  // Connection settings
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
  reconnectAttempts: 5,
  reconnectDelay: 3000,
  reconnectDelayMultiplier: 1.5,
  maxReconnectDelay: 30000,

  // Ping/pong settings
  pingInterval: 30000,
  pongTimeout: 5000,

  // Message settings
  maxMessageSize: 64 * 1024, // 64KB
  messageQueueSize: 100,

  // Timeout settings
  connectionTimeout: 10000,
  requestTimeout: 5000,
}

/**
 * ROOM_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ROOM_CONFIG.
 */
export const ROOM_CONFIG = {
  minPlayers: 2,
  maxPlayers: 10,
  defaultMaxPlayers: 4,
  minRoomNameLength: 3,
  maxRoomNameLength: 50,
  minPasswordLength: 4,
  maxPasswordLength: 50,
  roomTimeout: 3600000, // 1 hour
}

/**
 * CHAT_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CHAT_CONFIG.
 */
export const CHAT_CONFIG = {
  maxMessageLength: 500,
  minMessageLength: 1,
  maxMessagesPerSecond: 3,
  maxMessageHistory: 100,
  messageTimeout: 5000,
}

/**
 * SYNC_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SYNC_CONFIG.
 */
export const SYNC_CONFIG = {
  tickRate: 60, // 60 ticks per second
  interpolationDelay: 100, // 100ms
  maxPositionDelta: 1000,
  maxStateDelta: 10000,
  compressionThreshold: 1024,
}

/**
 * LATENCY_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LATENCY_CONFIG.
 */
export const LATENCY_CONFIG = {
  measurementInterval: 5000,
  historySize: 10,
  warningThreshold: 150,
  errorThreshold: 300,
}
