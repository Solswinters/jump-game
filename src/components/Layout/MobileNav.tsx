/**
 * Mobile navigation menu
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1"
        aria-label="Toggle menu"
      >
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-black">
          <nav className="flex flex-col gap-4 p-4">
            <Link
              href="/game"
              className="rounded-lg p-4 transition-colors hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Play
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-lg p-4 transition-colors hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="/rewards"
              className="rounded-lg p-4 transition-colors hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Rewards
            </Link>
            <Link
              href="/multiplayer"
              className="rounded-lg p-4 transition-colors hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Multiplayer
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
