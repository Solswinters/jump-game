/**
 * Voice chat button component
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/Button'

interface VoiceChatButtonProps {
  onToggle?: (enabled: boolean) => void
}

export function VoiceChatButton({ onToggle }: VoiceChatButtonProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    onToggle?.(newState)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!isEnabled) {
    return (
      <Button onClick={handleToggle} variant="outline" size="sm">
        🎤 Enable Voice Chat
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleMute} variant={isMuted ? 'default' : 'outline'} size="sm">
        {isMuted ? '🔇 Muted' : '🔊 Active'}
      </Button>
      <Button onClick={handleToggle} variant="outline" size="sm">
        ❌ Leave
      </Button>
    </div>
  )
}
