/**
 * Hook for connection recovery
 */

import { useState, useEffect, useCallback } from 'react'
import { ConnectionRecoveryService } from '../services/ConnectionRecoveryService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const recoveryService = new ConnectionRecoveryService()

/**
 * useConnectionRecovery utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useConnectionRecovery.
 */
export function useConnectionRecovery() {
  const { isConnected } = useWebSocket()
  const [isRecovering, setIsRecovering] = useState(false)
  const [canRecover, setCanRecover] = useState(true)

  useEffect(() => {
    if (!isConnected && !isRecovering) {
      recoveryService.startRecovery()
      setIsRecovering(true)
    } else if (isConnected && isRecovering) {
      recoveryService.successfulRecovery()
      setIsRecovering(false)
    }
  }, [isConnected, isRecovering])

  useEffect(() => {
    const interval = setInterval(() => {
      setCanRecover(recoveryService.canRecover())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const forceReconnect = useCallback(() => {
    if (recoveryService.recordAttempt()) {
      // Trigger reconnection logic
      window.location.reload()
    }
  }, [])

  return {
    isRecovering,
    canRecover,
    attemptCount: recoveryService.getState().attemptCount,
    forceReconnect,
  }
}
