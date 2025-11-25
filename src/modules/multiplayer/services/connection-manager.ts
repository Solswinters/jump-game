/**
 * Multiplayer connection management service
 */

import { io, type Socket } from 'socket.io-client'
import { getEnvironment } from '@/config/environment/validation'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { logger } from '@/utils/logger'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface ConnectionState {
  status: ConnectionStatus
  socket: Socket | null
  reconnectAttempts: number
  lastError: Error | null
}

class ConnectionManager {
  private state: ConnectionState = {
    status: 'disconnected',
    socket: null,
    reconnectAttempts: 0,
    lastError: null,
  }

  private maxReconnectAttempts = 5
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map()

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.state.status === 'connected' && this.state.socket) {
        resolve(this.state.socket)
        return
      }

      if (this.state.status === 'connecting') {
        reject(new Error('Connection already in progress'))
        return
      }

      this.state.status = 'connecting'
      const env = getEnvironment()
      const socketUrl = env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001'

      logger.info(`Connecting to multiplayer server: ${socketUrl}`)

      const socket = io(socketUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      })

      socket.on(SOCKET_EVENTS.CONNECT, () => {
        this.state.status = 'connected'
        this.state.socket = socket
        this.state.reconnectAttempts = 0
        this.state.lastError = null
        logger.info('Connected to multiplayer server')
        resolve(socket)
      })

      socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error: Error) => {
        this.state.status = 'error'
        this.state.lastError = error
        this.state.reconnectAttempts++
        logger.error('Connection error', error)
        reject(error)
      })

      socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
        this.state.status = 'disconnected'
        logger.warn(`Disconnected from server: ${reason}`)
      })

      socket.on(SOCKET_EVENTS.RECONNECT, (attemptNumber: number) => {
        logger.info(`Reconnected after ${attemptNumber} attempts`)
        this.state.reconnectAttempts = 0
      })

      this.state.socket = socket
    })
  }

  disconnect(): void {
    if (this.state.socket) {
      this.state.socket.disconnect()
      this.state.socket = null
      this.state.status = 'disconnected'
      this.clearAllListeners()
      logger.info('Disconnected from multiplayer server')
    }
  }

  getSocket(): Socket | null {
    return this.state.socket
  }

  getStatus(): ConnectionStatus {
    return this.state.status
  }

  isConnected(): boolean {
    return this.state.status === 'connected' && this.state.socket !== null
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.state.socket) {
      logger.warn('Cannot add listener: Socket not initialized')
      return
    }

    // Store the listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.add(callback)
    }

    this.state.socket.on(event, callback)
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (!this.state.socket) {
      return
    }

    if (callback) {
      this.state.socket.off(event, callback)
      const eventListeners = this.listeners.get(event)
      if (eventListeners) {
        eventListeners.delete(callback)
      }
    } else {
      this.state.socket.off(event)
      this.listeners.delete(event)
    }
  }

  emit(event: string, ...args: unknown[]): void {
    if (!this.state.socket || !this.isConnected()) {
      logger.warn(`Cannot emit event "${event}": Not connected`)
      return
    }

    this.state.socket.emit(event, ...args)
  }

  clearAllListeners(): void {
    if (this.state.socket) {
      this.state.socket.removeAllListeners()
    }
    this.listeners.clear()
  }

  getReconnectAttempts(): number {
    return this.state.reconnectAttempts
  }

  getLastError(): Error | null {
    return this.state.lastError
  }
}

/**
 * connectionManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of connectionManager.
 */
export const connectionManager = new ConnectionManager()
