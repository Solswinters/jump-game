/**
 * WebSocket service for real-time communication
 */

export type WebSocketEventType =
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'reconnect'
  | 'message'
  | 'player_joined'
  | 'player_left'
  | 'game_state_update'
  | 'chat_message'

export interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType
  data?: T
  timestamp: number
}

export type EventHandler<T = unknown> = (event: WebSocketEvent<T>) => void

export interface WebSocketConfig {
  url: string
  reconnect: boolean
  reconnectDelay: number
  reconnectAttempts: number
  heartbeatInterval: number
  timeout: number
}

const DEFAULT_CONFIG: WebSocketConfig = {
  url: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
  reconnect: true,
  reconnectDelay: 1000,
  reconnectAttempts: 5,
  heartbeatInterval: 30000,
  timeout: 5000,
}

export class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private handlers = new Map<WebSocketEventType, Set<EventHandler>>()
  private reconnectAttempt = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isConnecting = false
  private messageQueue: Array<{ type: string; data: unknown }> = []

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve()
    }

    this.isConnecting = true

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url)

        const timeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close()
            reject(new Error('Connection timeout'))
          }
        }, this.config.timeout)

        this.ws.onopen = () => {
          clearTimeout(timeout)
          this.isConnecting = false
          this.reconnectAttempt = 0
          this.startHeartbeat()
          this.flushMessageQueue()
          this.emit('connect')
          resolve()
        }

        this.ws.onclose = () => {
          this.stopHeartbeat()
          this.emit('disconnect')
          this.handleReconnect()
        }

        this.ws.onerror = error => {
          clearTimeout(timeout)
          this.isConnecting = false
          this.emit('error', { error: error.toString() })
          reject(error)
        }

        this.ws.onmessage = event => {
          try {
            const message = JSON.parse(event.data as string) as {
              type: WebSocketEventType
              data: unknown
            }
            this.emit(message.type, message.data)
            this.emit('message', message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.config.reconnect = false
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }

  /**
   * Send message to server
   */
  send<T = unknown>(type: string, data?: T): void {
    const message = { type, data }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Queue message for later
      this.messageQueue.push(message)
      return
    }

    try {
      this.ws.send(JSON.stringify(message))
    } catch (error) {
      console.error('Failed to send WebSocket message:', error)
    }
  }

  /**
   * Register event handler
   */
  on<T = unknown>(type: WebSocketEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }

    this.handlers.get(type)!.add(handler as EventHandler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(type)?.delete(handler as EventHandler)
    }
  }

  /**
   * Unregister event handler
   */
  off(type: WebSocketEventType, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler)
  }

  /**
   * Emit event to handlers
   */
  private emit<T = unknown>(type: WebSocketEventType, data?: T): void {
    const event: WebSocketEvent<T> = {
      type,
      data,
      timestamp: Date.now(),
    }

    this.handlers.get(type)?.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error(`Error in ${type} handler:`, error)
      }
    })
  }

  /**
   * Handle reconnection
   */
  private handleReconnect(): void {
    if (!this.config.reconnect || this.reconnectAttempt >= this.config.reconnectAttempts) {
      return
    }

    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempt)
    this.reconnectAttempt++

    setTimeout(() => {
      this.emit('reconnect', { attempt: this.reconnectAttempt })
      void this.connect()
    }, delay)
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping')
      }
    }, this.config.heartbeatInterval)
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message.type, message.data)
      }
    }
  }

  /**
   * Get connection state
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Get connection state
   */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }
}
