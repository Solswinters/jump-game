/**
 * Multiplayer actions hook
 */

'use client'

import { useRoomActions } from './useRoomActions'
import { useChatActions } from './useChatActions'

/**
 * useMultiplayerActions utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useMultiplayerActions.
 */
export function useMultiplayerActions() {
  const roomActions = useRoomActions()
  const chatActions = useChatActions()

  return {
    ...roomActions,
    ...chatActions,
  }
}
