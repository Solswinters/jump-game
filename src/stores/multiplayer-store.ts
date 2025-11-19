import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor'
export type RoomStatus = 'idle' | 'searching' | 'in-room' | 'in-game' | 'ended'
export type MatchmakingMode = 'casual' | 'ranked' | 'tournament' | 'private'

interface ChatMessage {
  id: string
  playerId: string
  username: string
  message: string
  timestamp: number
}

interface Player {
  id: string
  address: string
  username?: string
  score: number
  position: number
  velocity: number
  isAlive: boolean
  powerUps: string[]
  ping: number
  rank?: number
  rating?: number
}

interface Room {
  id: string
  name: string
  mode: MatchmakingMode
  hostId: string
  playerCount: number
  maxPlayers: number
  status: 'waiting' | 'starting' | 'in-progress' | 'ended'
  settings: {
    difficulty: string
    duration: number
    isPrivate: boolean
    requiresWallet: boolean
  }
}

interface GameSync {
  timestamp: number
  obstaclesSynced: number
  lastSyncTime: number
  syncInterval: number
}

interface MultiplayerStoreState {
  // Connection
  isConnected: boolean
  connectionQuality: ConnectionQuality
  ping: number
  reconnectAttempts: number

  // Room & Matchmaking
  roomStatus: RoomStatus
  currentRoom: Room | null
  availableRooms: Room[]
  matchmakingMode: MatchmakingMode
  isSearching: boolean

  // Players
  players: Map<string, Player>
  localPlayerId: string | null
  spectatorMode: boolean

  // Game Sync
  gameSync: GameSync

  // Chat & Social
  chatMessages: ChatMessage[]
  unreadMessages: number

  // Leaderboard
  liveLeaderboard: Player[]

  // Actions - Connection
  setConnected: (connected: boolean) => void
  setConnectionQuality: (quality: ConnectionQuality) => void
  setPing: (ping: number) => void
  incrementReconnectAttempts: () => void
  resetReconnectAttempts: () => void

  // Actions - Room
  setRoomStatus: (status: RoomStatus) => void
  setCurrentRoom: (room: Room | null) => void
  setAvailableRooms: (rooms: Room[]) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  setMatchmakingMode: (mode: MatchmakingMode) => void
  setSearching: (searching: boolean) => void

  // Actions - Players
  setLocalPlayerId: (id: string | null) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  updatePlayer: (playerId: string, updates: Partial<Player>) => void
  setSpectatorMode: (spectator: boolean) => void
  clearPlayers: () => void

  // Actions - Game Sync
  updateGameSync: (sync: Partial<GameSync>) => void

  // Actions - Chat
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChat: () => void
  markMessagesRead: () => void

  // Actions - Leaderboard
  updateLeaderboard: (players: Player[]) => void

  // Actions - Reset
  reset: () => void
  leaveRoom: () => void
}

const initialGameSync: GameSync = {
  timestamp: 0,
  obstaclesSynced: 0,
  lastSyncTime: 0,
  syncInterval: 50,
}

export const useMultiplayerStore = create<MultiplayerStoreState>()(
  devtools(
    immer(set => ({
      // Initial State
      isConnected: false,
      connectionQuality: 'good',
      ping: 0,
      reconnectAttempts: 0,
      roomStatus: 'idle',
      currentRoom: null,
      availableRooms: [],
      matchmakingMode: 'casual',
      isSearching: false,
      players: new Map(),
      localPlayerId: null,
      spectatorMode: false,
      gameSync: initialGameSync,
      chatMessages: [],
      unreadMessages: 0,
      liveLeaderboard: [],

      // Connection Actions
      setConnected: connected => set({ isConnected: connected }),

      setConnectionQuality: quality => set({ connectionQuality: quality }),

      setPing: ping =>
        set(state => {
          state.ping = ping
          if (ping < 50) {state.connectionQuality = 'excellent'}
          else if (ping < 100) {state.connectionQuality = 'good'}
          else if (ping < 200) {state.connectionQuality = 'fair'}
          else {state.connectionQuality = 'poor'}
        }),

      incrementReconnectAttempts: () =>
        set(state => {
          state.reconnectAttempts += 1
        }),

      resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

      // Room Actions
      setRoomStatus: status => set({ roomStatus: status }),

      setCurrentRoom: room => set({ currentRoom: room }),

      setAvailableRooms: rooms => set({ availableRooms: rooms }),

      updateRoom: (roomId, updates) =>
        set(state => {
          if (state.currentRoom?.id === roomId) {
            state.currentRoom = { ...state.currentRoom, ...updates }
          }
          const roomIndex = state.availableRooms.findIndex(r => r.id === roomId)
          if (roomIndex !== -1) {
            state.availableRooms[roomIndex] = {
              ...state.availableRooms[roomIndex],
              ...updates,
            }
          }
        }),

      setMatchmakingMode: mode => set({ matchmakingMode: mode }),

      setSearching: searching => set({ isSearching: searching }),

      // Player Actions
      setLocalPlayerId: id => set({ localPlayerId: id }),

      addPlayer: player =>
        set(state => {
          state.players.set(player.id, player)
        }),

      removePlayer: playerId =>
        set(state => {
          state.players.delete(playerId)
        }),

      updatePlayer: (playerId, updates) =>
        set(state => {
          const player = state.players.get(playerId)
          if (player) {
            state.players.set(playerId, { ...player, ...updates })
          }
        }),

      setSpectatorMode: spectator => set({ spectatorMode: spectator }),

      clearPlayers: () =>
        set(state => {
          state.players.clear()
        }),

      // Game Sync Actions
      updateGameSync: sync =>
        set(state => {
          state.gameSync = { ...state.gameSync, ...sync }
        }),

      // Chat Actions
      addChatMessage: message =>
        set(state => {
          const fullMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
          }
          state.chatMessages.push(fullMessage)
          state.unreadMessages += 1
          // Keep only last 100 messages
          if (state.chatMessages.length > 100) {
            state.chatMessages = state.chatMessages.slice(-100)
          }
        }),

      clearChat: () =>
        set(state => {
          state.chatMessages = []
          state.unreadMessages = 0
        }),

      markMessagesRead: () => set({ unreadMessages: 0 }),

      // Leaderboard Actions
      updateLeaderboard: players =>
        set(state => {
          state.liveLeaderboard = [...players].sort((a, b) => b.score - a.score)
        }),

      // Reset Actions
      reset: () =>
        set(state => {
          state.isConnected = false
          state.roomStatus = 'idle'
          state.currentRoom = null
          state.availableRooms = []
          state.isSearching = false
          state.players.clear()
          state.localPlayerId = null
          state.spectatorMode = false
          state.gameSync = initialGameSync
          state.chatMessages = []
          state.unreadMessages = 0
          state.liveLeaderboard = []
          state.reconnectAttempts = 0
        }),

      leaveRoom: () =>
        set(state => {
          state.roomStatus = 'idle'
          state.currentRoom = null
          state.players.clear()
          state.liveLeaderboard = []
          state.chatMessages = []
          state.unreadMessages = 0
        }),
    })),
    { name: 'MultiplayerStore' }
  )
)
