/**
 * Session timer component
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from '../hooks/useSession'
import { formatDuration } from '../utils'

export function SessionTimer() {
  const { isActive, getSessionDuration } = useSession()
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setDuration(Math.floor(getSessionDuration() / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, getSessionDuration])

  if (!isActive) return null

  return (
    <div className="rounded-lg bg-gray-800 px-4 py-2 text-white">
      <span className="text-sm text-gray-400">Time: </span>
      <span className="font-mono text-lg">{formatDuration(duration)}</span>
    </div>
  )
}
