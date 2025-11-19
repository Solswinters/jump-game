import { useMultiplayerStore } from '../multiplayer-store'

// Connection selectors
export const useIsConnected = () => useMultiplayerStore(state => state.isConnected)
export const useConnectionQuality = () => useMultiplayerStore(state => state.connectionQuality)
export const usePing = () => useMultiplayerStore(state => state.ping)

// Room selectors
export const useRoomStatus = () => useMultiplayerStore(state => state.roomStatus)
export const useCurrentRoom = () => useMultiplayerStore(state => state.currentRoom)
export const useAvailableRooms = () => useMultiplayerStore(state => state.availableRooms)
export const useIsSearching = () => useMultiplayerStore(state => state.isSearching)
export const useIsInRoom = () => useMultiplayerStore(state => state.roomStatus === 'in-room')
export const useIsInGame = () => useMultiplayerStore(state => state.roomStatus === 'in-game')

// Player selectors
export const usePlayers = () => useMultiplayerStore(state => Array.from(state.players.values()))
export const usePlayerCount = () => useMultiplayerStore(state => state.players.size)
export const useLocalPlayerId = () => useMultiplayerStore(state => state.localPlayerId)
export const useLocalPlayer = () =>
  useMultiplayerStore(state => {
    const id = state.localPlayerId
    return id ? state.players.get(id) : null
  })
export const useIsSpectator = () => useMultiplayerStore(state => state.spectatorMode)

// Chat selectors
export const useChatMessages = () => useMultiplayerStore(state => state.chatMessages)
export const useUnreadMessages = () => useMultiplayerStore(state => state.unreadMessages)
export const useHasUnreadMessages = () => useMultiplayerStore(state => state.unreadMessages > 0)

// Leaderboard selectors
export const useLiveLeaderboard = () => useMultiplayerStore(state => state.liveLeaderboard)
export const useTopPlayers = (count = 3) =>
  useMultiplayerStore(state => state.liveLeaderboard.slice(0, count))

// Combined selectors
export const useRoomInfo = () =>
  useMultiplayerStore(state => ({
    status: state.roomStatus,
    room: state.currentRoom,
    playerCount: state.players.size,
    isSearching: state.isSearching,
  }))

export const useConnectionInfo = () =>
  useMultiplayerStore(state => ({
    isConnected: state.isConnected,
    quality: state.connectionQuality,
    ping: state.ping,
    reconnectAttempts: state.reconnectAttempts,
  }))

export const useGameSync = () => useMultiplayerStore(state => state.gameSync)

// Player by ID selector factory
export const usePlayer = (playerId: string | null) =>
  useMultiplayerStore(state => (playerId ? state.players.get(playerId) : null))

// Alive players selector
export const useAlivePlayers = () =>
  useMultiplayerStore(state => Array.from(state.players.values()).filter(player => player.isAlive))

export const useAlivePlayerCount = () =>
  useMultiplayerStore(
    state => Array.from(state.players.values()).filter(player => player.isAlive).length
  )
