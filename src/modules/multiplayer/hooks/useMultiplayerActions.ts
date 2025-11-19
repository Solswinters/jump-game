/**
 * Multiplayer actions hook
 */

'use client'

import { useRoomActions } from './useRoomActions'
import { useChatActions } from './useChatActions'

export function useMultiplayerActions() {
  const roomActions = useRoomActions()
  const chatActions = useChatActions()

  return {
    ...roomActions,
    ...chatActions,
  }
}
