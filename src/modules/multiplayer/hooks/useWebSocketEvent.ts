/**
 * Hook for subscribing to WebSocket events
 */

import { useEffect } from 'react'
import { useWebSocket } from './useWebSocket'
import type { WebSocketEventType, WebSocketEvent, EventHandler } from '../services/WebSocketService'

export function useWebSocketEvent<T = unknown>(
  type: WebSocketEventType,
  handler: EventHandler<T>,
  deps: React.DependencyList = []
) {
  const { on } = useWebSocket()

  useEffect(() => {
    const unsubscribe = on<T>(type, handler)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, on, ...deps])
}
