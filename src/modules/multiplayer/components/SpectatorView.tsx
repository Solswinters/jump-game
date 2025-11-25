/**
 * Spectator view component
 */

'use client'

import { Badge } from '@/shared/components/Badge'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'

interface SpectatorViewProps {
  spectators: Array<{
    id: string
    name: string
  }>
  players: Array<{
    id: string
    name: string
    score: number
    isAlive?: boolean
  }>
  selectedPlayerId?: string
  onSelectPlayer: (playerId: string) => void
  onLeave: () => void
}

/**
 * SpectatorView utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SpectatorView.
 */
export function SpectatorView({
  spectators,
  players,
  selectedPlayerId,
  onSelectPlayer,
  onLeave,
}: SpectatorViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">👁️ Spectating</Badge>
            <span className="text-sm text-gray-400">
              {spectators.length} spectator{spectators.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Button onClick={onLeave} variant="outline" size="sm">
            Leave
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold text-white">Players</h3>
        <div className="space-y-2">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => onSelectPlayer(player.id)}
              className={`w-full rounded-lg p-3 text-left transition-colors ${
                selectedPlayerId === player.id
                  ? 'bg-purple-500/20 ring-1 ring-purple-500'
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{player.name}</span>
                    {player.isAlive === false && <Badge variant="error">Eliminated</Badge>}
                  </div>
                  <span className="text-sm text-gray-400">Score: {player.score}</span>
                </div>
                {selectedPlayerId === player.id && (
                  <span className="text-sm text-purple-400">Watching</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
