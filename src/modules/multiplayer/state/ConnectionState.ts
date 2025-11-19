/**
 * Connection state management
 */

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

export interface ConnectionMetrics {
  connectedAt: number | null
  disconnectedAt: number | null
  reconnectAttempts: number
  lastError: string | null
  totalDisconnects: number
  uptime: number
}

export class ConnectionState {
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED
  private metrics: ConnectionMetrics = {
    connectedAt: null,
    disconnectedAt: null,
    reconnectAttempts: 0,
    lastError: null,
    totalDisconnects: 0,
    uptime: 0,
  }
  private listeners: Set<(status: ConnectionStatus) => void> = new Set()

  getStatus(): ConnectionStatus {
    return this.status
  }

  getMetrics(): ConnectionMetrics {
    if (this.metrics.connectedAt) {
      this.metrics.uptime = Date.now() - this.metrics.connectedAt
    }
    return { ...this.metrics }
  }

  setConnecting(): void {
    this.updateStatus(ConnectionStatus.CONNECTING)
  }

  setConnected(): void {
    this.metrics.connectedAt = Date.now()
    this.metrics.disconnectedAt = null
    this.metrics.reconnectAttempts = 0
    this.metrics.lastError = null
    this.updateStatus(ConnectionStatus.CONNECTED)
  }

  setReconnecting(): void {
    this.metrics.reconnectAttempts++
    this.updateStatus(ConnectionStatus.RECONNECTING)
  }

  setDisconnected(error?: string): void {
    this.metrics.disconnectedAt = Date.now()
    this.metrics.totalDisconnects++
    if (error) {
      this.metrics.lastError = error
    }
    this.updateStatus(ConnectionStatus.DISCONNECTED)
  }

  setError(error: string): void {
    this.metrics.lastError = error
    this.updateStatus(ConnectionStatus.ERROR)
  }

  isConnected(): boolean {
    return this.status === ConnectionStatus.CONNECTED
  }

  isConnecting(): boolean {
    return (
      this.status === ConnectionStatus.CONNECTING || this.status === ConnectionStatus.RECONNECTING
    )
  }

  subscribe(callback: (status: ConnectionStatus) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  reset(): void {
    this.status = ConnectionStatus.DISCONNECTED
    this.metrics = {
      connectedAt: null,
      disconnectedAt: null,
      reconnectAttempts: 0,
      lastError: null,
      totalDisconnects: 0,
      uptime: 0,
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.status = status
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.status))
  }
}
