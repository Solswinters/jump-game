/**
 * Quick join component
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { Card } from '@/shared/components/Card'

interface QuickJoinProps {
  onJoin: (roomCode: string) => void
  onQuickMatch: () => void
  loading?: boolean
}

export function QuickJoin({ onJoin, onQuickMatch, loading = false }: QuickJoinProps) {
  const [roomCode, setRoomCode] = useState('')

  const handleJoin = () => {
    if (roomCode.trim()) {
      onJoin(roomCode.toUpperCase())
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-white">Join Room</h3>
          <div className="flex gap-2">
            <Input
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              maxLength={6}
              className="flex-1 uppercase"
            />
            <Button onClick={handleJoin} disabled={!roomCode.trim() || loading} variant="default">
              Join
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-800 px-2 text-gray-400">or</span>
          </div>
        </div>

        <Button onClick={onQuickMatch} disabled={loading} variant="outline" className="w-full">
          Quick Match
        </Button>
      </div>
    </Card>
  )
}
