/**
 * Network utilities for multiplayer functionality
 * Provides WebSocket management and message handling
 */

export interface NetworkMessage {
  type: string
  data: any
  timestamp: number
  sender?: string
}

export interface NetworkConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export type MessageHandler = (message: NetworkMessage) => void

export class GameNetworkUtils {
  private static socket: WebSocket | null = null
  private static config: NetworkConfig | null = null
  private static messageHandlers: Map<string, Set<MessageHandler>> = new Map()
  private static reconnectAttempts = 0
  private static reconnectTimer: NodeJS.Timeout | null = null
  private static heartbeatTimer: NodeJS.Timeout | null = null
  private static isConnecting = false
  private static messageQueue: NetworkMessage[] = []

  /**
   * Initialize network connection
   */
  static async connect(config: NetworkConfig): Promise<void> {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    this.config = config
    this.isConnecting = true

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(config.url)

        this.socket.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.processMessageQueue()
          resolve()
        }

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }

        this.socket.onclose = () => {
          console.log('WebSocket closed')
          this.stopHeartbeat()
          this.attemptReconnect()
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * Disconnect from network
   */
  static disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.stopHeartbeat()

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    this.reconnectAttempts = 0
    this.messageQueue = []
  }

  /**
   * Send message to server
   */
  static send(type: string, data: any): void {
    const message: NetworkMessage = {
      type,
      data,
      timestamp: Date.now(),
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      // Queue message if not connected
      this.messageQueue.push(message)
    }
  }

  /**
   * Register message handler
   */
  static on(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set())
    }

    this.messageHandlers.get(messageType)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(messageType)?.delete(handler)
    }
  }

  /**
   * Remove message handler
   */
  static off(messageType: string, handler: MessageHandler): void {
    this.messageHandlers.get(messageType)?.delete(handler)
  }

  /**
   * Handle incoming message
   */
  private static handleMessage(data: string): void {
    try {
      const message: NetworkMessage = JSON.parse(data)

      // Trigger handlers for this message type
      const handlers = this.messageHandlers.get(message.type)
      if (handlers) {
        handlers.forEach((handler) => handler(message))
      }

      // Trigger wildcard handlers
      const wildcardHandlers = this.messageHandlers.get('*')
      if (wildcardHandlers) {
        wildcardHandlers.forEach((handler) => handler(message))
      }
    } catch (error) {
      console.error('Failed to parse message:', error)
    }
  }

  /**
   * Attempt to reconnect
   */
  private static attemptReconnect(): void {
    if (!this.config) return

    const maxAttempts = this.config.maxReconnectAttempts || 10
    const interval = this.config.reconnectInterval || 5000

    if (this.reconnectAttempts < maxAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${maxAttempts})...`)

      this.reconnectTimer = setTimeout(() => {
        this.connect(this.config!)
      }, interval)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  /**
   * Start heartbeat
   */
  private static startHeartbeat(): void {
    const interval = this.config?.heartbeatInterval || 30000

    this.heartbeatTimer = setInterval(() => {
      this.send('heartbeat', { timestamp: Date.now() })
    }, interval)
  }

  /**
   * Stop heartbeat
   */
  private static stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Process queued messages
   */
  private static processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()
      if (message) {
        this.socket.send(JSON.stringify(message))
      }
    }
  }

  /**
   * Check if connected
   */
  static isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  /**
   * Get connection state
   */
  static getState(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.socket) return 'closed'

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'open'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'closed'
    }
  }

  /**
   * Get reconnect attempts
   */
  static getReconnectAttempts(): number {
    return this.reconnectAttempts
  }

  /**
   * Clear all handlers
   */
  static clearHandlers(): void {
    this.messageHandlers.clear()
  }

  /**
   * Broadcast to all players
   */
  static broadcast(type: string, data: any): void {
    this.send('broadcast', { type, data })
  }

  /**
   * Send to specific player
   */
  static sendToPlayer(playerId: string, type: string, data: any): void {
    this.send('private', { playerId, type, data })
  }

  /**
   * Join room
   */
  static joinRoom(roomId: string): void {
    this.send('join_room', { roomId })
  }

  /**
   * Leave room
   */
  static leaveRoom(roomId: string): void {
    this.send('leave_room', { roomId })
  }

  /**
   * Get latency (ping)
   */
  static async getLatency(): Promise<number> {
    return new Promise((resolve) => {
      const startTime = Date.now()

      const unsubscribe = this.on('pong', () => {
        const latency = Date.now() - startTime
        unsubscribe()
        resolve(latency)
      })

      this.send('ping', { timestamp: startTime })

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe()
        resolve(-1)
      }, 5000)
    })
  }

  /**
   * Enable binary message support
   */
  static sendBinary(data: ArrayBuffer): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(data)
    }
  }

  /**
   * Get queue size
   */
  static getQueueSize(): number {
    return this.messageQueue.length
  }

  /**
   * Clear message queue
   */
  static clearQueue(): void {
    this.messageQueue = []
  }
}
