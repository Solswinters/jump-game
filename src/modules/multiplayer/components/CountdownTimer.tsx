/**
 * Countdown timer component
 */

'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  duration: number
  onComplete: () => void
}

export function CountdownTimer({ duration, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onComplete])

  const seconds = Math.ceil(timeLeft / 1000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-bounce text-center">
        <div className="text-8xl font-bold text-white drop-shadow-lg">{seconds}</div>
        <div className="mt-4 text-2xl text-gray-300">Get Ready!</div>
      </div>
    </div>
  )
}
