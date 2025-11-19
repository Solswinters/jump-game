/**
 * Multiplayer state tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { ConnectionState, ConnectionStatus } from '../state/ConnectionState'
import { GameState, GamePhase } from '../state/GameState'
import { RoomState } from '../state/RoomState'

describe('ConnectionState', () => {
  let connectionState: ConnectionState

  beforeEach(() => {
    connectionState = new ConnectionState()
  })

  it('should start disconnected', () => {
    expect(connectionState.getStatus()).toBe(ConnectionStatus.DISCONNECTED)
  })

  it('should transition to connected', () => {
    connectionState.setConnecting()
    expect(connectionState.getStatus()).toBe(ConnectionStatus.CONNECTING)

    connectionState.setConnected()
    expect(connectionState.getStatus()).toBe(ConnectionStatus.CONNECTED)
    expect(connectionState.isConnected()).toBe(true)
  })

  it('should track reconnect attempts', () => {
    connectionState.setReconnecting()
    const metrics = connectionState.getMetrics()
    expect(metrics.reconnectAttempts).toBe(1)
  })

  it('should notify listeners', () => {
    let notified = false
    connectionState.subscribe(() => {
      notified = true
    })

    connectionState.setConnected()
    expect(notified).toBe(true)
  })
})

describe('GameState', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = new GameState()
  })

  it('should start in lobby', () => {
    expect(gameState.getPhase()).toBe(GamePhase.LOBBY)
  })

  it('should track game duration', () => {
    gameState.setPhase(GamePhase.PLAYING)
    setTimeout(() => {
      const duration = gameState.getDuration()
      expect(duration).toBeGreaterThan(0)
    }, 100)
  })

  it('should calculate rankings', () => {
    gameState.updateScore('player1', 100)
    gameState.updateScore('player2', 200)
    gameState.setPhase(GamePhase.FINISHED)

    const rankings = gameState.getRankings()
    expect(rankings[0]).toBe('player2')
    expect(rankings[1]).toBe('player1')
  })
})

describe('RoomState', () => {
  let roomState: RoomState

  beforeEach(() => {
    roomState = new RoomState()
  })

  it('should start without a room', () => {
    expect(roomState.isInRoom()).toBe(false)
  })

  it('should manage players', () => {
    roomState.addPlayer({
      id: '1',
      name: 'Player1',
      score: 0,
      isReady: false,
      joinedAt: Date.now(),
    })

    expect(roomState.getPlayerCount()).toBe(1)
    expect(roomState.getPlayer('1')).toBeDefined()
  })

  it('should update player properties', () => {
    roomState.addPlayer({
      id: '1',
      name: 'Player1',
      score: 0,
      isReady: false,
      joinedAt: Date.now(),
    })

    roomState.updatePlayer('1', { isReady: true })
    const player = roomState.getPlayer('1')
    expect(player?.isReady).toBe(true)
  })
})
