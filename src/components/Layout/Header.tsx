/**
 * Application header component
 */

'use client'

import Link from 'next/link'
import { WalletButton } from '@/modules/wallet'

/**
 * Header utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Header.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gradient">
          Samodoge
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/game" className="transition-colors hover:text-purple-400">
            Play
          </Link>
          <Link href="/leaderboard" className="transition-colors hover:text-purple-400">
            Leaderboard
          </Link>
          <Link href="/rewards" className="transition-colors hover:text-purple-400">
            Rewards
          </Link>
          <Link href="/multiplayer" className="transition-colors hover:text-purple-400">
            Multiplayer
          </Link>
        </nav>

        <WalletButton />
      </div>
    </header>
  )
}
