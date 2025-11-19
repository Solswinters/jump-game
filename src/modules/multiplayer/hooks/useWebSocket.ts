/**
 * React hook for WebSocket connections
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  WebSocketService,
  type WebSocketEventType,
  type WebSocketEvent,
  type EventHandler,
} from '../services/WebSocketService'

// Singleton instance
let wsService: WebSocketService | null = null

function getWebSocketService(): WebSocketService {
  if (!wsService) {
    wsService = new WebSocketService()
  }
  return wsService
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const wsRef = useRef<WebSocketService>(getWebSocketService())

  useEffect(() => {
    const ws = wsRef.current

    const handleConnect = () => {
      setIsConnected(true)
      setError(null)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    const handleError = (event: WebSocketEvent) => {
      setError(new Error(String(event.data)))
    }

    ws.on('connect', handleConnect)
    ws.on('disconnect', handleDisconnect)
    ws.on('error', handleError)

    // Auto-connect
    void ws.connect()

    return () => {
      ws.off('connect', handleConnect)
      ws.off('disconnect', handleDisconnect)
      ws.off('error', handleError)
    }
  }, [])

  const send = useCallback(<T = unknown>(type: string, data?: T) => {
    wsRef.current.send(type, data)
  }, [])

  const on = useCallback(<T = unknown>(type: WebSocketEventType, handler: EventHandler<T>) => {
    return wsRef.current.on(type, handler)
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current.disconnect()
  }, [])

  return {
    isConnected,
    error,
    send,
    on,
    disconnect,
  }
}
