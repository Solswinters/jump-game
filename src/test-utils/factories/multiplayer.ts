/**
 * Test data factories for multiplayer objects
 */

export const createMockPlayer = (id: string = 'player-1') => ({
  id,
  username: `Player${id}`,
  address: `0x${id.padStart(40, '0')}`,
  score: 0,
  isReady: false,
  isOnline: true,
})

export const createMockRoom = (id: string = 'room-1') => ({
  id,
  name: 'Test Room',
  hostId: 'player-1',
  players: [createMockPlayer()],
  maxPlayers: 4,
  isActive: false,
  gameMode: 'battle-royale',
  createdAt: Date.now(),
})

export const createMockChatMessage = (playerId: string = 'player-1') => ({
  id: `msg-${Date.now()}`,
  playerId,
  username: `Player${playerId}`,
  message: 'Hello, world!',
  timestamp: Date.now(),
})

export const createMockMultiplayerState = () => ({
  currentRoom: null,
  rooms: [],
  players: [],
  isConnected: false,
  chatMessages: [],
})
