/**
 * Game HUD component
 */

'use client'

import { useGameStore } from '@/stores/game-store'

export function GameHUD() {
  const { score, lives, level, combo } = useGameStore(state => ({
    score: state.score,
    lives: state.lives,
    level: state.level,
    combo: state.combo,
  }))

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="rounded-lg bg-gray-900/80 px-4 py-2 backdrop-blur">
          <div className="text-xs text-gray-400">Score</div>
          <div className="font-mono text-2xl font-bold text-white">{score.toLocaleString()}</div>
        </div>

        <div className="rounded-lg bg-gray-900/80 px-4 py-2 backdrop-blur">
          <div className="text-xs text-gray-400">Level</div>
          <div className="text-2xl font-bold text-purple-500">{level}</div>
        </div>

        <div className="rounded-lg bg-gray-900/80 px-4 py-2 backdrop-blur">
          <div className="text-xs text-gray-400">Lives</div>
          <div className="flex gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} className="text-xl text-red-500">
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Combo Counter */}
      {combo > 1 && (
        <div className="absolute left-1/2 top-20 -translate-x-1/2 animate-pulse">
          <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 text-center shadow-lg">
            <div className="text-3xl font-bold text-white">{combo}x</div>
            <div className="text-xs uppercase text-white/80">Combo</div>
          </div>
        </div>
      )}
    </div>
  )
}
