/**
 * Player card component
 */

'use client'

import { Badge } from '@/shared/components/Badge'
import { Card } from '@/shared/components/Card'

interface PlayerCardProps {
  player: {
    id: string
    name: string
    score: number
    isReady: boolean
    isHost?: boolean
  }
  showActions?: boolean
  onKick?: (playerId: string) => void
  onPromote?: (playerId: string) => void
}

export function PlayerCard({ player, showActions = false, onKick, onPromote }: PlayerCardProps) {
  return (
    <Card className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-semibold text-white">
          {player.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{player.name}</span>
            {player.isHost && <Badge variant="default">Host</Badge>}
            {player.isReady && <Badge variant="success">Ready</Badge>}
          </div>
          <div className="text-sm text-gray-400">Score: {player.score}</div>
        </div>
      </div>

      {showActions && !player.isHost && (
        <div className="flex gap-2">
          {onPromote && (
            <button
              onClick={() => onPromote(player.id)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Promote
            </button>
          )}
          {onKick && (
            <button
              onClick={() => onKick(player.id)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Kick
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
