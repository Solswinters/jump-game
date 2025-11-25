/**
 * Player utilities for multiplayer
 */

export interface Player {
  id: string
  name: string
  score: number
  isAlive: boolean
  isReady: boolean
}

/**
 * createPlayer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createPlayer.
 */
export function createPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    isAlive: true,
    isReady: false,
  }
}

/**
 * getPlayerRank utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getPlayerRank.
 */
export function getPlayerRank(player: Player, players: Player[]): number {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  return sortedPlayers.findIndex((p) => p.id === player.id) + 1
}

/**
 * getTopPlayer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getTopPlayer.
 */
export function getTopPlayer(players: Player[]): Player | null {
  if (players.length === 0) {
    return null
  }

  return players.reduce((top, current) => (current.score > top.score ? current : top))
}

/**
 * getAlivePlayers utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAlivePlayers.
 */
export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter((p) => p.isAlive)
}

/**
 * areAllPlayersReady utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of areAllPlayersReady.
 */
export function areAllPlayersReady(players: Player[]): boolean {
  return players.length > 0 && players.every((p) => p.isReady)
}

/**
 * formatPlayerName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatPlayerName.
 */
export function formatPlayerName(name: string, maxLength: number = 12): string {
  if (name.length <= maxLength) {
    return name
  }

  return `${name.slice(0, maxLength - 3)}...`
}

/**
 * getPlayerInitials utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getPlayerInitials.
 */
export function getPlayerInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1 && words[0]) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
