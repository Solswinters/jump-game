/**
 * Multiplayer connection management service
 */

import { io, type Socket } from 'socket.io-client'
import { WS_CONFIG } from '@/config/api'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

class ConnectionManager {
  private socket: Socket | null = null
  private status: ConnectionStatus = 'disconnected'
  private reconnectAttempts = 0
  private maxReconnectAttempts = WS_CONFIG.reconnectionAttempts
  private reconnectDelay = WS_CONFIG.reconnectionDelay

  connect(): void {
    if (this.socket?.connected) {
      return
    }

    this.status = 'connecting'
    this.socket = io(WS_CONFIG.url, {
      transports: WS_CONFIG.transports as ('websocket' | 'polling')[],
      reconnection: WS_CONFIG.reconnection,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: WS_CONFIG.timeout,
    })

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    if (!this.socket) {
      return
    }

    this.socket.on('connect', () => {
      this.status = 'connected'
      this.reconnectAttempts = 0
      console.log('Connected to multiplayer server')
    })

    this.socket.on('disconnect', reason => {
      this.status = 'disconnected'
      console.log('Disconnected from server:', reason)
    })

    this.socket.on('connect_error', error => {
      this.status = 'error'
      this.reconnectAttempts++
      console.error('Connection error:', error)

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.disconnect()
      }
    })

    this.socket.on('reconnect', attempt => {
      console.log('Reconnected after', attempt, 'attempts')
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.status = 'disconnected'
    this.reconnectAttempts = 0
  }

  getSocket(): Socket | null {
    return this.socket
  }

  getStatus(): ConnectionStatus {
    return this.status
  }

  isConnected(): boolean {
    return this.status === 'connected' && this.socket?.connected === true
  }

  emit(event: string, ...args: unknown[]): void {
    if (this.isConnected() && this.socket) {
      this.socket.emit(event, ...args)
    }
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  once(event: string, callback: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.once(event, callback)
    }
  }
}

export const connectionManager = new ConnectionManager()
